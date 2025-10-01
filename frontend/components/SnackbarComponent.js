import React from 'react';
import { Text } from 'react-native';
import { Snackbar } from 'react-native-paper';

const SnackbarComponent = ({ visible, onDismiss, message, type = 'success' }) => {
  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismiss}
      duration={3000}
      style={{
        backgroundColor: type === 'success' ? '#4caf50' : '#f44336',
      }}
      action={{
        label: 'Close',
        onPress: onDismiss,
        textColor: 'white',
      }}
    >
      <Text style={{ color: 'white' }}>{message}</Text>
    </Snackbar>
  );
};

export default SnackbarComponent;
