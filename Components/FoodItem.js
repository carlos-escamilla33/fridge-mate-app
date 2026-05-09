import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../constants/colors';

function getExpiryInfo(expiryDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  const diffMs = expiry - today;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { label: 'Expired', style: 'danger' };
  if (diffDays === 0) return { label: 'Today', style: 'danger' };
  if (diffDays === 1) return { label: '1 day', style: 'warn' };
  if (diffDays <= 3) return { label: `${diffDays} days`, style: 'warn' };
  return { label: `${diffDays} days`, style: 'ok' };
}

export default function FoodItem({ item, onPress }) {
  const expiry = getExpiryInfo(item.expiryDate);

  const pillStyle =
    expiry.style === 'danger'
      ? styles.pillDanger
      : expiry.style === 'warn'
      ? styles.pillWarn
      : styles.pillOk;

  const pillTextStyle =
    expiry.style === 'danger'
      ? styles.pillTextDanger
      : expiry.style === 'warn'
      ? styles.pillTextWarn
      : styles.pillTextOk;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={styles.emojiWrap}>
        <Text style={styles.emoji}>{item.emoji ?? '🥡'}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.meta}>
          Added by {item.addedBy ?? 'You'} · {item.quantity ?? ''}
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
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emojiWrap: {
    width: 46,
    height: 46,
    backgroundColor: Colors.parchment,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  emoji: {
    fontSize: 24,
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
    color: Colors.bark,
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