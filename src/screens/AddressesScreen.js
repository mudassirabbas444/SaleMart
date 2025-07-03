import {View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import React, {useState} from 'react';
import CustomButton from '../components/CustomButton';
import { MaterialIcons } from '@expo/vector-icons';

export default function AddressesScreen({navigation}){
    const [addresses, setAddresses] = useState([
        {
            id: 1,
            name: 'John Doe',
            address: '123 Main Street, Block A',
            city: 'Lahore',
            state: 'Punjab',
            zip: '54000',
            country: 'Pakistan',
            phone: '+92 300 1234567',
            isDefault: true
        },
        {
            id: 2,
            name: 'Jane Smith',
            address: '456 Park Avenue, Suite 5',
            city: 'Islamabad',
            state: 'Federal Territory',
            zip: '44000',
            country: 'Pakistan',
            phone: '+92 301 9876543',
            isDefault: false
        }
    ]);

    const deleteAddress = (id) => {
        Alert.alert(
            'Delete Address',
            'Are you sure you want to delete this address?',
            [
                {text: 'Cancel', style: 'cancel'},
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        setAddresses(addresses.filter(addr => addr.id !== id));
                    }
                }
            ]
        );
    };

    const setDefaultAddress = (id) => {
        setAddresses(addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === id
        })));
    };

    const AddressCard = ({address}) => (
        <View style={styles.addressCard}>
            <View style={styles.cardHeader}>
                <View style={styles.nameSection}>
                    <MaterialIcons name="person" size={20} color="#667eea" />
                    <Text style={styles.nameText}>{address.name}</Text>
                    {address.isDefault && (
                        <View style={styles.defaultBadge}>
                            <Text style={styles.defaultText}>Default</Text>
                        </View>
                    )}
                </View>
                <View style={styles.actionButtons}>
                    <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => setDefaultAddress(address.id)}
                        disabled={address.isDefault}
                    >
                        <MaterialIcons 
                            name="star" 
                            size={20} 
                            color={address.isDefault ? "#ffd700" : "#ccc"} 
                        />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => deleteAddress(address.id)}
                    >
                        <MaterialIcons name="delete" size={20} color="#e74c3c" />
                    </TouchableOpacity>
                </View>
            </View>
            
            <View style={styles.addressDetails}>
                <View style={styles.detailRow}>
                    <MaterialIcons name="home" size={16} color="#666" />
                    <Text style={styles.detailText}>{address.address}</Text>
                </View>
                <View style={styles.detailRow}>
                    <MaterialIcons name="location-city" size={16} color="#666" />
                    <Text style={styles.detailText}>
                        {address.city}, {address.state} {address.zip}
                    </Text>
                </View>
                <View style={styles.detailRow}>
                    <MaterialIcons name="public" size={16} color="#666" />
                    <Text style={styles.detailText}>{address.country}</Text>
                </View>
                <View style={styles.detailRow}>
                    <MaterialIcons name="phone" size={16} color="#666" />
                    <Text style={styles.detailText}>{address.phone}</Text>
                </View>
            </View>
        </View>
    );

    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <MaterialIcons name="location-on" size={24} color="#667eea" />
                <Text style={styles.headerText}>My Addresses</Text>
            </View>
            
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {addresses.length === 0 ? (
                    <View style={styles.emptyState}>
                        <MaterialIcons name="location-off" size={64} color="#ccc" />
                        <Text style={styles.emptyText}>No addresses found</Text>
                        <Text style={styles.emptySubtext}>Add your first address to get started</Text>
                    </View>
                ) : (
                    <View style={styles.addressesList}>
                        {addresses.map((address) => (
                            <AddressCard key={address.id} address={address} />
                        ))}
                    </View>
                )}
            </ScrollView>
            
            <View style={styles.footer}>
                <CustomButton
                    title="Add New Address"
                    onPress={() => navigation.navigate('AddAddress')}
                    style={styles.addButton}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 10,
    },
    scrollView: {
        flex: 1,
        padding: 20,
    },
    addressesList: {
        gap: 15,
    },
    addressCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 15,
    },
    nameSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    nameText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 8,
        flex: 1,
    },
    defaultBadge: {
        backgroundColor: '#667eea',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 8,
    },
    defaultText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 10,
    },
    actionButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#f8f9fa',
    },
    addressDetails: {
        gap: 8,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailText: {
        fontSize: 16,
        color: '#666',
        marginLeft: 8,
        flex: 1,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#666',
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 16,
        color: '#999',
        marginTop: 8,
        textAlign: 'center',
    },
    footer: {
        padding: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e9ecef',
    },
    addButton: {
        marginBottom: 10,
    },
});
