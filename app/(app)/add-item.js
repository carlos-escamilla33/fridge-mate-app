import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Colors from "../../constants/colors";
import Pug from "../../components/Pug";
import { useAuth } from "../../context/AuthContext";
import { useAccount } from "../../context/AccountContext";
import { scanFoodPhoto, createItemsBulk } from "../../api/items";
import { displayToIso } from "../../utils/dates";
import { setPendingPhoto } from "../../utils/scanPhoto";

// Claude doesn't benefit from images larger than this, and smaller uploads are faster.
const MAX_IMAGE_SIDE = 1568;
// Size of the photo saved with the item (about 30-50KB).
const THUMBNAIL_SIDE = 512;

export default function AddItemScreen() {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState("");
  const { token } = useAuth();
  const { activeMember } = useAccount();

  function handleScanPress() {
    Alert.alert("Scan an item", "Fill the photo with the item you want to add.", [
      { text: "Take Photo", onPress: () => pickAndScan("camera") },
      { text: "Choose from Library", onPress: () => pickAndScan("library") },
      { text: "Cancel", style: "cancel" },
    ]);
  }

  async function pickAndScan(source) {
    setScanError("");

    let result;
    if (source === "camera") {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        setScanError("Camera access is needed to scan. You can turn it on in Settings.");
        return;
      }
      result = await ImagePicker.launchCameraAsync({ mediaTypes: ["images"] });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"] });
    }

    if (result.canceled) return;

    setScanning(true);
    try {
      const photo = result.assets[0];
      const resize = photo.width >= photo.height ? { width: MAX_IMAGE_SIDE } : { height: MAX_IMAGE_SIDE };
      const needsResize = Math.max(photo.width, photo.height) > MAX_IMAGE_SIDE;

      const context = ImageManipulator.manipulate(photo.uri);
      if (needsResize) context.resize(resize);
      const image = await context.renderAsync();
      const resized = await image.saveAsync({ compress: 0.7, format: SaveFormat.JPEG, base64: true });

      const items = await scanFoodPhoto(token, resized.base64);

      if (items.length === 0) {
        setScanError("No food found in that photo. Try getting closer or better lighting.");
        return;
      }

      // Smaller copy of the photo to keep with the item.
      const thumbContext = ImageManipulator.manipulate(resized.uri);
      thumbContext.resize(photo.width >= photo.height ? { width: THUMBNAIL_SIDE } : { height: THUMBNAIL_SIDE });
      const thumbImage = await thumbContext.renderAsync();
      const thumbnail = await thumbImage.saveAsync({ compress: 0.6, format: SaveFormat.JPEG, base64: true });
      setPendingPhoto({ uri: thumbnail.uri, base64: thumbnail.base64 });

      router.push({ pathname: "/scan-review", params: { items: JSON.stringify(items) } });
    } catch (err) {
      setScanError(err.message ?? "Scan failed. Try again.");
    } finally {
      setScanning(false);
    }
  }

  function validate() {
    const e = {};
    if (name.trim().length < 2) e.name = "Item name is required.";
    if (!expiryDate.trim()) e.expiryDate = "Expiration date is required.";
    else if (!displayToIso(expiryDate)) e.expiryDate = "Enter a valid date (MM/DD/YYYY).";
    if (quantity && !/^\d+$/.test(quantity.trim())) e.quantity = "Enter a whole number.";
    if (!activeMember) e.name = "Pick a profile first.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleAdd() {
    if (!validate()) return;
    setLoading(true);
    try {
      await createItemsBulk(token, activeMember.id, [
        {
          foodName: name.trim(),
          expirationDate: displayToIso(expiryDate),
          ripenessLevel: "fresh",
          quantity: Math.min(20, Math.max(1, parseInt(quantity, 10) || 1)),
        },
      ]);
      setSuccess(true);
      setTimeout(() => router.replace("/(app)/home"), 800);
    } catch (err) {
      setErrors({ name: err.message ?? "Could not add item. Try again." });
    } finally {
      setLoading(false);
    }
  }

  function handleAddAnother() {
    setName("");
    setQuantity("");
    setExpiryDate("");
    setErrors({});
    setSuccess(false);
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={styles.flex} edges={["top"]}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather name="x" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
            <Text style={styles.title}>Add Item</Text>
            <View style={{ width: 20 }} />
          </View>

          <TouchableOpacity
            style={styles.scanZone}
            activeOpacity={0.75}
            onPress={handleScanPress}
            disabled={scanning}
          >
            <View style={styles.scanIconWrap}>
              {scanning ? (
                <Pug variant="fawn" size={48} />
              ) : (
                <Feather name="camera" size={26} color={Colors.textSecondary} />
              )}
            </View>
            <Text style={styles.scanTitle}>{scanning ? "Sniffing it out..." : "Scan an item"}</Text>
            <Text style={styles.scanSubtitle}>
              {scanning ? "This takes a few seconds" : "AI will identify it and estimate expiry"}
            </Text>
          </TouchableOpacity>

          {scanError ? (
            <View style={styles.scanErrorBanner}>
              <Feather name="alert-circle" size={16} color={Colors.dangerText} />
              <Text style={styles.scanErrorText}>{scanError}</Text>
            </View>
          ) : null}

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or enter manually</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.form}>
            <Input
              label="Item Name"
              value={name}
              onChangeText={setName}
              placeholder="e.g. Organic Strawberries"
              error={errors.name}
              autoCapitalize="words"
            />

            <View style={styles.row}>
              <View style={styles.rowHalf}>
                <Input
                  label="Quantity"
                  value={quantity}
                  onChangeText={setQuantity}
                  placeholder="1"
                  keyboardType="number-pad"
                  error={errors.quantity}
                />
              </View>
              <View style={styles.rowHalf}>
                <Input
                  label="Expiry Date"
                  value={expiryDate}
                  onChangeText={setExpiryDate}
                  placeholder="MM/DD/YYYY"
                  keyboardType="numbers-and-punctuation"
                  error={errors.expiryDate}
                />
              </View>
            </View>

            {success ? (
              <View style={styles.successBanner}>
                <Feather name="check-circle" size={18} color={Colors.successText} />
                <Text style={styles.successText}>Item added to your fridge!</Text>
              </View>
            ) : (
              <>
                <Button
                  label="Add to Fridge"
                  onPress={handleAdd}
                  loading={loading}
                  style={styles.submitBtn}
                />
                <Button label="Add Another" onPress={handleAddAnother} variant="secondary" />
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 16,
    paddingBottom: 20,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.textPrimary,
    letterSpacing: -0.2,
  },
  scanZone: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderStyle: "dashed",
    borderRadius: 16,
    height: 148,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 24,
  },
  scanIconWrap: {
    width: 52,
    height: 52,
    backgroundColor: Colors.borderLight,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  scanTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  scanSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  scanErrorBanner: {
    backgroundColor: Colors.dangerBg,
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: -12,
    marginBottom: 20,
  },
  scanErrorText: {
    flex: 1,
    fontSize: 13,
    color: Colors.dangerText,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  form: {
    gap: 2,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  rowHalf: {
    flex: 1,
  },
  submitBtn: {
    marginTop: 8,
    marginBottom: 10,
  },
  successBanner: {
    backgroundColor: Colors.successBg,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
  },
  successText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.successText,
  },
});
