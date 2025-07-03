import {View, Text, ScrollView, StyleSheet, Alert} from 'react-native';
import { TextInput } from 'react-native';
import React,{useState} from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import CustomInput from '../components/CustomInput'; 
import CustomButton from '../components/CustomButton';
import { MaterialIcons } from '@expo/vector-icons';

export default function AddAddress({navigation}){
    const addAddress=(name,address,city,state,zip,country,phone)=>{
        if (!name || !address || !city || !state || !zip || !country || !phone) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        console.log("add address")
        console.log(name,address,city,state,zip,country,phone)
        Alert.alert('Success', 'Address added successfully!', [
            {text: 'OK', onPress: () => navigation.goBack()}
        ]);
    };
    
    const data=[{label:'Lahore', value:'lahore'},
       {label:'Islamabad', value:'islamabad'},
       {label:'Karachi', value:'karachi'},
       {label:'Quetta', value:'quetta'},
       {label:'Peshawar', value:'peshawar'},
       {label:'Multan', value:'multan'},
       {label:'Faisalabad', value:'faisalabad'},
       {label:'Rawalpindi', value:'rawalpindi'}
    ];
    const states=[{label:'Punjab', value:'punjab'},
        {label:'Sindh', value:'sindh'},
        {label:'Balochistan', value:'balochistan'},
        {label:'Khyber Pakhtunkhwa', value:'kpk'},
        {label:'Gilgit Baltistan', value:'gilgit baltistan'}
    ];
    const [name,setName]=useState("");
    const [city,setCity]=useState("");
    const [state,setState]=useState("");
    const [zip,setZip]=useState("");
    const [country,setCountry]=useState("");
    const [phone,setPhone]=useState("");
    const [address,setAddress]=useState("");

    return(
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <MaterialIcons name="location-on" size={24} color="#667eea" />
                <Text style={styles.headerText}>Add New Address</Text>
            </View>
            
            <View style={styles.form}>
                <CustomInput 
                    label="Full Name" 
                    placeholder="Enter your full name" 
                    value={name} 
                    onChangeText={setName}
                    icon="person"
                />
                
                <CustomInput 
                    label="Address" 
                    placeholder="Enter your street address" 
                    value={address} 
                    onChangeText={setAddress}
                    icon="home"
                />
                
                <View style={styles.dropdownContainer}>
                    <Text style={styles.label}>City</Text>
                    <Dropdown 
                        data={data}
                        search
                        labelField="label"
                        valueField="value"
                        placeholder="Select City"
                        value={city}
                        onChange={item=>{setCity(item.value)}}
                        style={styles.dropdown}
                        placeholderStyle={styles.dropdownPlaceholder}
                        selectedTextStyle={styles.dropdownSelectedText}
                        inputSearchStyle={styles.dropdownSearch}
                        iconStyle={styles.dropdownIcon}
                        containerStyle={styles.dropdownContainerStyle}
                    />
                </View>
                
                <View style={styles.dropdownContainer}>
                    <Text style={styles.label}>State</Text>
                    <Dropdown 
                        data={states}
                        search
                        searchField="label"
                        searchPlaceholderTextColor='#999'
                        searchPlaceholder='Search State'
                        labelField="label"
                        valueField="value"
                        placeholder="Select State"
                        value={state}
                        onChange={(item)=>{setState(item.value)}}
                        style={styles.dropdown}
                        placeholderStyle={styles.dropdownPlaceholder}
                        selectedTextStyle={styles.dropdownSelectedText}
                        inputSearchStyle={styles.dropdownSearch}
                        iconStyle={styles.dropdownIcon}
                        containerStyle={styles.dropdownContainerStyle}
                    />
                </View>
                
                <CustomInput 
                    label="Zip Code" 
                    placeholder="Enter zip code" 
                    value={zip} 
                    onChangeText={setZip}
                    icon="mail"
                    keyboardType="numeric"
                />
                
                <CustomInput 
                    label="Country" 
                    placeholder="Enter country" 
                    value={country} 
                    onChangeText={setCountry}
                    icon="public"
                />
                
                <CustomInput 
                    label="Phone Number" 
                    placeholder="Enter phone number" 
                    value={phone} 
                    onChangeText={setPhone}
                    icon="phone"
                    keyboardType="phone-pad"
                />
                
                <View style={styles.buttonContainer}>
                    <CustomButton 
                        title="Add Address" 
                        onPress={()=>{addAddress(name,address,city,state,zip,country,phone)}}
                        style={styles.addButton}
                    />
                </View>
            </View>
        </ScrollView>
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
        paddingBottom: 10,
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
    form: {
        padding: 20,
    },
    dropdownContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    dropdown: {
        height: 50,
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'transparent',
        paddingHorizontal: 16,
        paddingVertical: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    dropdownPlaceholder: {
        fontSize: 16,
        color: '#999',
    },
    dropdownSelectedText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    dropdownSearch: {
        height: 40,
        fontSize: 16,
        color: '#333',
    },
    dropdownIcon: {
        width: 20,
        height: 20,
    },
    dropdownContainerStyle: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e9ecef',
        marginTop: 8,
    },
    buttonContainer: {
        marginTop: 20,
    },
    addButton: {
        marginTop: 10,
    },
});