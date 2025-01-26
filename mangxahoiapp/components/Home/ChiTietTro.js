import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, Button, Alert, Image, ScrollView, Modal, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import axios from 'axios';

import { MyUserContext } from "../../configs/MyUserContext";

const ChiTietTro = ({ route, navigation }) => {
  const { troId } = route.params;
  const userLogin = useContext(MyUserContext);
  const [tro, setTro] = useState(null);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [images, setImages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

 
  const [advertiseModalVisible, setAdvertiseModalVisible] = useState(false);
  const [advertiseTitle, setAdvertiseTitle] = useState('');
  const [advertiseContent, setAdvertiseContent] = useState('');

  useEffect(() => {
    axios.get(`https://toquocbinh2102.pythonanywhere.com/tros/${troId}/`)
      .then(response => {
        setTro(response.data);
        setSelectedCity(response.data.thanh_pho);
        setSelectedDistrict(response.data.quan);
        setSelectedWard(response.data.phuong);
      })
      .catch(error => {
        console.error("Lỗi khi lấy thông tin trọ", error);
        alert("Đã có lỗi xảy ra.");
      });
  }, [troId]);

 
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
          setDistricts(response.data.districts);
        } catch (error) {
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
          setWards(response.data.wards);
        } catch (error) {
          console.error("Error fetching wards:", error);
        }
      };

      fetchWards();
    }
  }, [selectedDistrict]);


  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get("https://toquocbinh2102.pythonanywhere.com/anhtros/");
        const filteredImages = response.data.filter(image => image.tro === troId); 
        setImages(filteredImages);
      } catch (error) {
        console.error("Lỗi khi lấy ảnh", error);
        alert("Đã có lỗi xảy ra khi lấy ảnh.");
      }
    };

    fetchImages();
  }, [troId]);

  // Handle delete tro
  const handleDelete = () => {
    Alert.alert(
      "Xóa trọ",
      "Bạn có chắc muốn xóa trọ này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa", onPress: () => {
            axios.delete(`https://toquocbinh2102.pythonanywhere.com/tros/${troId}/`)
              .then(() => {
                alert("Xóa trọ thành công!");
                navigation.goBack(); 
              })
              .catch(error => {
                console.error("Lỗi khi xóa trọ", error);
                alert("Đã có lỗi xảy ra khi xóa trọ.");
              });
          }
        },
      ]
    );
  };

 
  const getCityName = (cityId) => cities.find(city => city.id === cityId)?.name || '';
  const getDistrictName = (districtId) => districts.find(district => district.id === districtId)?.name || '';
  const getWardName = (wardId) => wards.find(ward => ward.id === wardId)?.name || '';


  const handleImagePress = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  
  const handleAdvertiseSubmit = () => {
    if (!advertiseTitle || !advertiseContent) {
      alert("Vui lòng điền đầy đủ tiêu đề và nội dung.");
      return;
    }

    const userId = userLogin.id;

    axios.post("https://toquocbinh2102.pythonanywhere.com/baidangchothues/", {
      tieuDe: advertiseTitle,
      thongTin: advertiseContent,
      nguoiDangBai: userId,
      troChoThue: troId,
    })
      .then(() => {
        alert("Quảng cáo trọ thành công!");
        setAdvertiseModalVisible(false);
        setAdvertiseTitle('');
        setAdvertiseContent('');
      })
      .catch(error => {
        console.error("Lỗi khi đăng quảng cáo", error);
        alert("Đã có lỗi xảy ra khi đăng quảng cáo.");
      });
  };

  if (!tro) {
    return <Text>Đang tải thông tin trọ...</Text>;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Chi Tiết Trọ</Text>

        <Text style={styles.label}>Tên Trọ:</Text>
        <Text style={styles.info}>{tro.tenTro}</Text>

        <Text style={styles.label}>Địa Chỉ:</Text>
        <Text style={styles.info}>{tro.diaChi}</Text>

        <Text style={styles.label}>Giá:</Text>
        <Text style={styles.info}>{tro.gia} VND</Text>

        <Text style={styles.label}>Số Người Ở:</Text>
        <Text style={styles.info}>{tro.soNguoiO}</Text>

        <Text style={styles.label}>Thành phố:</Text>
        <Text style={styles.info}>{getCityName(selectedCity)}</Text>

        <Text style={styles.label}>Quận:</Text>
        <Text style={styles.info}>{getDistrictName(selectedDistrict)}</Text>

        <Text style={styles.label}>Phường:</Text>
        <Text style={styles.info}>{getWardName(selectedWard)}</Text>

        <Text style={styles.imageTitle}>Ảnh của Trọ</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageContainer}>
          {images.length === 0 ? (
            <Text>Không có ảnh</Text>
          ) : (
            images.map((image, index) => (
              <TouchableOpacity key={index} onPress={() => handleImagePress(image.anh)}>
                <Image
                  source={{ uri: image.anh }}
                  style={styles.image}
                />
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </ScrollView>

      <View style={styles.buttonContainer}>

  {userLogin.id === tro.nguoiChoThue && (
    <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
      <Text style={styles.buttonText}>Xóa trọ</Text>
    </TouchableOpacity>
  )}
  
  
  {userLogin.id === tro.nguoiChoThue && (
    <TouchableOpacity style={styles.advertiseButton} onPress={() => setAdvertiseModalVisible(true)}>
      <Text style={styles.buttonText}>Đăng bài cho thuê</Text>
    </TouchableOpacity>
  )}
</View>

      
      <Modal
        visible={advertiseModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setAdvertiseModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setAdvertiseModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <Text style={styles.label}>Tiêu đề:</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập tiêu đề"
              value={advertiseTitle}
              onChangeText={setAdvertiseTitle}
            />
            <Text style={styles.label}>Nội dung:</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập nội dung"
              value={advertiseContent}
              onChangeText={setAdvertiseContent}
              multiline
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleAdvertiseSubmit}>
              <Text style={styles.buttonText}>Đăng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

     
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <Image
              source={{ uri: selectedImage }}
              style={styles.modalImage}
            />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 20,
    flexGrow: 1,  
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#0288d1",
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 5,
    color: "#444",
  },
  info: {
    fontSize: 16,
    marginBottom: 15,
    color: "#555",
  },
  imageTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#0288d1",
  },
  imageContainer: {
    flexDirection: "row",
    marginBottom: 15,
    paddingVertical: 10,
  },
  image: {
    width: 150,
    height: 150,
    marginRight: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,  
  },
  deleteButton: {
    backgroundColor: "#f44336",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 0.48,
    alignItems: "center",
  },
  advertiseButton: {
    backgroundColor: "#0288d1",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 0.48,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#ff0000",
    padding: 5,
    borderRadius: 50,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 20,
  },
  modalImage: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
  },
  submitButton: {
    backgroundColor: "#0288d1",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
});

export default ChiTietTro;
