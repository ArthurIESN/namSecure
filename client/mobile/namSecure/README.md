# Help Type - React Native avec TypeScript

## Types Essentiels

### 1. Props & Components
```typescript
// Props de base
type Props = {
  title: string;
  count?: number;         // Optionnel
  onPress: () => void;    // Fonction
  children: React.ReactNode; // Composants enfants
}

// Composant typé
const MyComponent: React.FC<Props> = ({ title, count, onPress, children }) => {
  return (
    <View>
      <Text>{title}</Text>
    </View>
  );
};
```

### 2. States & Hooks
```typescript
// État simple
const [count, setCount] = useState<number>(0);

// État complexe
interface UserState {
  name: string;
  age: number;
  isActive: boolean;
}
const [user, setUser] = useState<UserState>({ name: '', age: 0, isActive: false });
```

### 3. Styles
```typescript
interface Styles {
  container: ViewStyle;
  text: TextStyle;
  image: ImageStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    padding: 20
  },
  text: {
    fontSize: 16
  },
  image: {
    width: 100,
    height: 100
  }
});
```

### 4. Events
```typescript
// Event Press
const onPress = (event: GestureResponderEvent) => {
  // code
};

// TextInput
const onChangeText = (text: string) => {
  // code
};
```

### 5. Navigation
```typescript
type RootStackParamList = {
  Home: undefined;
  Profile: { userId: string };
  Settings: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;
```

### 6. API & Async
```typescript
interface ApiResponse {
  data: {
    id: string;
    name: string;
  }[];
  status: number;
}

const fetchData = async (): Promise<ApiResponse> => {
  // code
};
```

### 7. Composants React Native Courants
```typescript
// Image
<Image source={{ uri: string }} style={{ width: number, height: number }} />

// TextInput
<TextInput
  value={string}
  onChangeText={(text: string) => void}
  placeholder={string}
/>

// TouchableOpacity
<TouchableOpacity
  onPress={() => void}
  disabled={boolean}
/>
```

### 8. Erreurs Communes
```typescript
// ❌ Éviter
const [data, setData] = useState([]); // Type any[]

// ✅ Correct
const [data, setData] = useState<string[]>([]);
```

## Astuces

- Utilisez `interface` pour les objets extensibles
- Utilisez `type` pour les unions/intersections
- Évitez `any`, préférez `unknown`
- Activez `strict: true` dans tsconfig.json

## Extensions VSCode Utiles

- TypeScript ESLint
- Pretty TypeScript Errors