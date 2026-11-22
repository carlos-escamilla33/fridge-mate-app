import { useRef } from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Feather } from '@expo/vector-icons';
import Colors from '../constants/colors';

// Swipe a row left to reveal a Delete button; tapping it calls onDelete.
// Reveal-then-tap avoids deleting things by accident while scrolling.
export default function SwipeToDelete({ onDelete, children }) {
  const swipeableRef = useRef(null);

  function handleDelete() {
    swipeableRef.current?.close();
    onDelete();
  }

  function renderRightActions() {
    return (
      <Pressable
        style={({ pressed }) => [styles.action, pressed && styles.actionPressed]}
        onPress={handleDelete}
        accessibilityRole="button"
        accessibilityLabel="Delete"
      >
        <Feather name="trash-2" size={18} color={Colors.white} />
        <Text style={styles.actionText}>Delete</Text>
      </Pressable>
    );
  }

  return (
    <ReanimatedSwipeable
      ref={swipeableRef}
      friction={2}
      rightThreshold={40}
      overshootRight={false}
      renderRightActions={renderRightActions}
    >
      {children}
    </ReanimatedSwipeable>
  );
}

const styles = StyleSheet.create({
  action: {
    width: 84,
    marginLeft: 8,
    borderRadius: 14,
    backgroundColor: Colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  actionPressed: {
    opacity: 0.85,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
  },
});
