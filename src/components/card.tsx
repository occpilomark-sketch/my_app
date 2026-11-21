import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
    name: string;
    description: string;
    image: string;
    onEdit?: () => void;
    onDelete?: () => void;
}

export default function Card({ name, description, image, onEdit, onDelete }: Props) {
    return (
        <View style={styles.card}>
            <Image source={{ uri: image }} style={styles.image} resizeMode='cover' />
            <View style={styles.content}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.description} numberOfLines={2}>{description}</Text>
            </View>

            {/* Edit / Delete Buttons row */}
            <View style={styles.actionRow}>
                <TouchableOpacity style={styles.editBtn} onPress={onEdit}>
                    <Text style={styles.actionText}>EDIT</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
                    <Text style={styles.actionText}>DELETE</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        overflow: 'hidden',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    image: {
        height: 180,
        width: '100%',
        backgroundColor: '#F3F4F6',
    },
    content: {
        padding: 12,
        gap: 4,
    },
    name: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    description: {
        fontSize: 14,
        color: '#4B5563',
    },
    actionRow: {
        flexDirection: 'row',
        padding: 10,
        gap: 10,
        backgroundColor: '#F9FAFB',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    editBtn: {
        flex: 1,
        backgroundColor: '#3B82F6',
        paddingVertical: 10,
        borderRadius: 6,
        alignItems: 'center',
    },
    deleteBtn: {
        flex: 1,
        backgroundColor: '#EF4444',
        paddingVertical: 10,
        borderRadius: 6,
        alignItems: 'center',
    },
    actionText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
});