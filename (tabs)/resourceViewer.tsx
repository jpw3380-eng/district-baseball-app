import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';

export default function ResourceViewerScreen() {
  const { title, url, previousPage } = useLocalSearchParams<{
    title: string;
    url: string;
    previousPage: string;
  }>();

  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() =>
          router.push((previousPage as any) || '/resources')
        }
      >
        <Text style={styles.backButton}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>

      <WebView
        source={{ uri: url }}
        style={styles.webview}
        startInLoadingState
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: 20,
  },
  backButton: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginBottom: 10,
    color: '#ffffff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginBottom: 10,
    color: '#ffffff',
  },
  webview: {
    flex: 1,
  },
});