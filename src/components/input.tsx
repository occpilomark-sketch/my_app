import { View, Text, TextInput } from 'react-native';

type Props = {
    label: string;
    onChangeText: (text: string) => void;
}

export default function Input({ label, onChangeText }: Props) {
    return (
        <View className="gap-1">
            <Text className="font-semibold text-gray-700">{label}</Text>
            <TextInput 
                onChangeText={onChangeText}
                placeholder={`Enter ${label.toLowerCase()}`}
                className="border border-gray-300 p-3 rounded-xl bg-gray-50 text-base"
            />
        </View>
    );
}