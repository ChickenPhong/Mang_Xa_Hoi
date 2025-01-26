import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, TextInput, Button, Image, ScrollView } from "react-native";
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { MyUserContext } from "../../configs/MyUserContext";

const ThemTro = ({ navigation }) => {
  const userLogin = useContext(MyUserContext); 
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [tenTro, setTenTro] = useState("");
  const [diaChi, setDiaChi] = useState("");
  const [gia, setGia] = useState("");
  const [soNguoiO, setSoNguoiO] = useState("");
  const [images, setImages] = useState([]);


  useEffect(() => {
    const getPermission = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Chúng tôi cần quyền truy cập ảnh để tiếp tục.');
      }
    };
    getPermission();
  }, []);

  
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
          if (response.data && response.data.districts) {
            setDistricts(response.data.districts);
          } else {
            setDistricts([]);
          }
        } catch (error) {
          setDistricts([]);
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
          if (response.data && response.data.wards) {
            setWards(response.data.wards);
          } else {
            setWards([]);
          }
        } catch (error) {
          setWards([]);
        }
      };
      fetchWards();
    }
  }, [selectedDistrict]);


  const handleImagePick = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.status !== 'granted') {
        alert('Quyền truy cập ảnh bị từ chối');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        const base64 = await FileSystem.readAsStringAsync(imageUri, { encoding: FileSystem.EncodingType.Base64 });
        setImages((prevImages) => [...prevImages, { ...result.assets[0], base64 }]);
      } else {
        console.log('Chọn ảnh bị hủy bỏ');
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  // Handle Add Tro
  const handleAddTro = async () => {
    if (!tenTro || !diaChi || !gia || !soNguoiO || !selectedCity || !selectedDistrict || !selectedWard || images.length < 3) {
      alert("Vui lòng điền đủ thông tin và chọn ít nhất 3 ảnh!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('tenTro', tenTro);
      formData.append('diaChi', diaChi);
      formData.append('gia', gia);
      formData.append('soNguoiO', soNguoiO);
      formData.append('thanh_pho', selectedCity);
      formData.append('quan', selectedDistrict);
      formData.append('phuong', selectedWard);
      formData.append('nguoiChoThue', userLogin.id);

      console.log("Form data trọ đã được tạo:", formData);

      const response = await axios.post("https://toquocbinh2102.pythonanywhere.com/tros/", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Response status:', response.status);
      console.log('Response data:', response.data);

      if (response.status !== 201) {
        throw new Error('Lỗi khi tạo trọ');
      }

      const troId = response.data.id; 
      console.log("ID của trọ mới tạo:", troId);

   
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const imageFormData = new FormData();
        const imageName = image.fileName || `image_${i}.jpg`; 
        const imageType = "image/jpeg";

        console.log(`Gửi ảnh ${i + 1}: ${imageName}, type: ${imageType}, URI: ${image.uri}`);

        imageFormData.append('anh', {
          uri: image.uri,
          type: imageType,
          name: imageName,
        });
        imageFormData.append('tro', troId);

        const imageResponse = await axios.post("https://toquocbinh2102.pythonanywhere.com/anhtros/", imageFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('Image response status:', imageResponse.status);
        console.log('Image response data:', imageResponse.data);

        if (imageResponse.status !== 201) {
          throw new Error('Lỗi khi thêm ảnh');
        }

        console.log("Ảnh đã được thêm vào trọ:", imageResponse.data);
      }

      alert("Thêm trọ và ảnh thành công!");
      navigation.goBack();
    } catch (error) {
      console.error("Lỗi khi thêm trọ hoặc ảnh:", error);
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thêm Trọ</Text>

      <TextInput
        style={styles.input}
        placeholder="Tên trọ"
        value={tenTro}
        onChangeText={setTenTro}
      />

      <TextInput
        style={styles.input}
        placeholder="Địa chỉ"
        value={diaChi}
        onChangeText={setDiaChi}
      />

      <TextInput
        style={styles.input}
        placeholder="Giá"
        keyboardType="numeric"
        value={gia}
        onChangeText={setGia}
      />

      <TextInput
        style={styles.input}
        placeholder="Số người ở"
        keyboardType="numeric"
        value={soNguoiO}
        onChangeText={setSoNguoiO}
      />

    
      <Picker
        selectedValue={selectedCity}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedCity(itemValue)}
      >
        <Picker.Item label="Chọn Thành phố" value={null} />
        {cities.map((city) => (
          <Picker.Item key={city.id} label={city.name} value={city.id} />
        ))}
      </Picker>

     
      <Picker
        selectedValue={selectedDistrict}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedDistrict(itemValue)}
      >
        <Picker.Item label="Chọn Quận" value={null} />
        {districts.map((district) => (
          <Picker.Item key={district.id} label={district.name} value={district.id} />
        ))}
      </Picker>

    
      <Picker
        selectedValue={selectedWard}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedWard(itemValue)}
      >
        <Picker.Item label="Chọn Phường" value={null} />
        {wards.map((ward) => (
          <Picker.Item key={ward.id} label={ward.name} value={ward.id} />
        ))}
      </Picker>

   
      <Button title="Chọn ảnh trọ" onPress={handleImagePick} />
      <ScrollView horizontal style={styles.imageContainer}>
        {images.map((image, index) => (
          <Image key={index} source={{ uri: image.uri }} style={styles.image} />
        ))}
      </ScrollView>

      <Button title="Thêm Trọ" onPress={handleAddTro} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  picker: {
    height: 50,
    marginBottom: 15,
  },
  imageContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
});

export default ThemTro;
