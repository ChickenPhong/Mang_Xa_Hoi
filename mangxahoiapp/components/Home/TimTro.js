import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { MyUserContext } from '../../configs/MyUserContext';

const TimTro = ({ navigation }) => {
  const userLogin = useContext(MyUserContext);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [troList, setTroList] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get("https://toquocbinh2102.pythonanywhere.com/api/address/cities");
        setCities(response.data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    if (selectedCity) {
      const fetchDistricts = async () => {
        try {
          const response = await axios.get(`https://toquocbinh2102.pythonanywhere.com/api/address/city/${selectedCity}`);
          setDistricts(response.data.districts || []);
        } catch (error) {
          setDistricts([]);
          console.error("Error fetching districts:", error);
        }
      };
      fetchDistricts();
    }
  }, [selectedCity]);

  useEffect(() => {
    if (selectedDistrict) {
      const fetchWards = async () => {
        try {
          const response = await axios.get(`https://toquocbinh2102.pythonanywhere.com/api/address/district/${selectedDistrict}`);
          setWards(response.data.wards || []);
        } catch (error) {
          setWards([]);
          console.error("Error fetching wards:", error);
        }
      };
      fetchWards();
    }
  }, [selectedDistrict]);

  const handleSearch = async () => {
    let url = "https://toquocbinh2102.pythonanywhere.com/tros/";
    const params = {};
    
    if (selectedCity) params.thanh_pho = selectedCity;
    if (selectedDistrict) params.quan = selectedDistrict;
    if (selectedWard) params.phuong = selectedWard;
    
    try {
      const response = await axios.get(url, { params });
      if (response.data && response.data.length > 0) {
        setTroList(response.data);
      } else {
        setTroList([]);
      }
    } catch (error) {
      console.error("Error fetching trọ:", error);
      setTroList([]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tìm Trọ</Text>

      <Text style={styles.label}>Chọn Tỉnh / Thành phố</Text>
      <Picker
        selectedValue={selectedCity}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedCity(itemValue)}
      >
        <Picker.Item label="Chọn Tỉnh / Thành phố" value={null} />
        {cities.map((city) => (
          <Picker.Item key={city.id} label={city.name} value={city.id} />
        ))}
      </Picker>

      <Text style={styles.label}>Chọn Quận / Huyện</Text>
      <Picker
        selectedValue={selectedDistrict}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedDistrict(itemValue)}
      >
        <Picker.Item label="Chọn Quận / Huyện" value={null} />
        {districts.map((district) => (
          <Picker.Item key={district.id} label={district.name} value={district.id} />
        ))}
      </Picker>

      <Text style={styles.label}>Chọn Xã / Phường</Text>
      <Picker
        selectedValue={selectedWard}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedWard(itemValue)}
      >
        <Picker.Item label="Chọn Xã / Phường" value={null} />
        {wards.map((ward) => (
          <Picker.Item key={ward.id} label={ward.name} value={ward.id} />
        ))}
      </Picker>

    
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>Tìm Trọ</Text>
      </TouchableOpacity>


      <ScrollView style={styles.resultContainer}>
        {troList.length > 0 ? (
          troList.map((tro) => (
            <TouchableOpacity
              key={tro.id}
              style={styles.troItem}
              onPress={() => navigation.navigate("ChiTietTro", { troId: tro.id })}
            >
              <Text style={styles.troName}>{tro.tenTro}</Text>
              <Text>Địa chỉ: {tro.diaChi}</Text>
              <Text style={styles.soNguoiO}>Số người ở: {tro.soNguoiO}</Text>
              <Text style={styles.gia}>Giá: {tro.gia} VND</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noResultsText}>Không có kết quả tìm kiếm</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#0288d1',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
    color: '#333',
  },
  picker: {
    height: 60,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  searchButton: {
    backgroundColor: '#0288d1',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 20,
  },
  troItem: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  troName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0288d1',
  },
  soNguoiO: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  gia: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d32f2f', 
  },
  noResultsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
});

export default TimTro;
