import { TouchableOpacity, Text } from 'react-native';

type Props = {
    label: string;
    onPress: () => void;
}

export default function Button({ label, onPress }: Props) {
    return (
        <TouchableOpacity onPress={onPress} className="bg-blue-600 p-4 rounded-xl items-center justify-center">
            <Text className="text-white font-bold text-base">{label}</Text>
        </TouchableOpacity>
    );
}