import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Colors from '../constants/colors';

// Items have no category, so pick a stable warm color from the item name.
function tileColor(name = '') {
  const sum = [...name].reduce((total, ch) => total + ch.charCodeAt(0), 0);
  return Colors.avatars[sum % Colors.avatars.length];
}

function getExpiryInfo(expiryDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  const diffDays = Math.round((expiry - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { label: 'Expired', style: 'danger' };
  if (diffDays === 0) return { label: 'Today', style: 'danger' };
  if (diffDays === 1) return { label: '1 day', style: 'warn' };
  if (diffDays <= 3) return { label: `${diffDays} days`, style: 'warn' };
  return { label: `${diffDays} days`, style: 'ok' };
}

export default function FoodItem({ item, onPress }) {
  const expiry = getExpiryInfo(item.expiryDate);
  const color = tileColor(item.name);
  const initial = item.name ? item.name[0].toUpperCase() : '?';

  const pillStyle =
    expiry.style === 'danger' ? styles.pillDanger
    : expiry.style === 'warn' ? styles.pillWarn
    : styles.pillOk;

  const pillTextStyle =
    expiry.style === 'danger' ? styles.pillTextDanger
    : expiry.style === 'warn' ? styles.pillTextWarn
    : styles.pillTextOk;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {item.image ? (
        <Image source={item.image} style={styles.photo} />
      ) : (
        <View style={[styles.iconWrap, { backgroundColor: color + '18' }]}>
          <Text style={[styles.iconText, { color }]}>{initial}</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.meta}>
          {item.addedBy ?? 'You'}{item.quantity ? ` · ${item.quantity}` : ''}
        </Text>
      </View>
      <View style={[styles.pill, pillStyle]}>
        <Text style={[styles.pillText, pillTextStyle]}>{expiry.label}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  photo: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: Colors.borderLight,
    flexShrink: 0,
  },
  iconText: {
    fontSize: 18,
    fontWeight: '700',
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  meta: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  pill: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    flexShrink: 0,
  },
  pillDanger: { backgroundColor: Colors.dangerBg },
  pillWarn: { backgroundColor: Colors.warnBg },
  pillOk: { backgroundColor: Colors.successBg },
  pillText: { fontSize: 11, fontWeight: '600' },
  pillTextDanger: { color: Colors.dangerText },
  pillTextWarn: { color: Colors.warnText },
  pillTextOk: { color: Colors.successText },
});
