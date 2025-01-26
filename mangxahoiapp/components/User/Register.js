import { useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from "react-native";
import { Button, HelperText, RadioButton, TextInput  } from "react-native-paper";
import MyStyles from "../../styles/MyStyles";
import APIs, { endpoints } from "../../configs/APIs";
import { useNavigation } from "@react-navigation/native";
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

const Register = () => {
    const [user, setUser] = useState({vaiTro:'3'});

    const users = {
        "first_name": {
            "title": "Tên",
            "field": "first_name",
            "icon": "text",
            "secureTextEntry": false
        }, "last_name": {
            "title": "Họ và tên lót",
            "field": "last_name",
            "icon": "text",
            "secureTextEntry": false
        }, "email": {
            "title": "Email",
            "field": "email",
            "icon": "text",
            "secureTextEntry": false
        }, "username": {
            "title": "Tên đăng nhập",
            "field": "username",
            "icon": "text",
            "secureTextEntry": false
        }, "password": {
            "title": "Mật khẩu",
            "field": "password",
            "icon": "eye",
            "secureTextEntry": true
        }, "confirm": {
            "title": "Xác nhận mật khẩu",
            "field": "confirm",
            "icon": "eye",
            "secureTextEntry": true
        }, "SDT": {
            "title": "Số điện thoại",
            "field": "SDT",
            "icon": "text",
            "secureTextEntry": false
        }
    }
    const nav = useNavigation();
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(false);
    const [images, setImages] = useState([]);

    const change = (value, field) => {
        setUser({...user, [field]: value});
    }

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
            setImages([{ ...result.assets[0], base64 }]);
          } else {
            console.log('Chọn ảnh bị hủy bỏ');
          }
        } catch (error) {
          console.error('Error picking image:', error);
        }
    };
    // const pickImage = async () => {
    //     let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    //     if (status !== 'granted') {
    //         alert("Permissions denied!");
    //     } else {
    //         const result = await ImagePicker.launchImageLibraryAsync();
    //         if (!result.canceled){
    //             const imageUri = result.assets[0].uri;
    //             const base64 = await FileSystem.readAsStringAsync(imageUri, { encoding: FileSystem.EncodingType.Base64 });
    //             // setImages([{ ...result.assets[0], base64 }]);
    //             setAvatar(result.assets[0],base64);
    //         }
    //     }
    // }

    const register = async () => {
        if (user.password !== user.confirm)
            setErr(true);
        else {
            setErr(false);
            let form = new FormData();
            for (let key in user)
                if (key !== 'confirm') {
                    form.append(key, user[key]);
                }

            const image = images[0];
            const imageName = image.fileName || `image.jpg`; 
            const imageType = "image/jpeg";

            form.append('image', {
            uri: image.uri,
            type: imageType,
            name: imageName,
            });

            console.info(form);
            try {
                setLoading(true);
                let res = await APIs.post(endpoints['register'], form, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.info(res.data)
                Alert.alert("Đăng ký thành công, mời bạn đăng nhập")
                nav.navigate("Login");
            } catch (ex) {
                // console.error("Lỗi trong quá trình gửi yêu cầu: ", ex);
                // // Kiểm tra thông tin lỗi chi tiết
                // if (ex.response) {
                //     console.error("Lỗi từ server: ", ex.response.data);
                // } else {
                //     console.error("Lỗi mạng hoặc cấu hình: ", ex.message);
                // }
            } finally {
                setLoading(false);
            }
        }
    };
    

    return (
        <View style={MyStyles.container}>
            <KeyboardAvoidingView  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

                <HelperText type="error" visible={err}>
                Mật khẩu KHÔNG khớp
                </HelperText>
            
                {Object.values(users).map(u => <TextInput secureTextEntry={u.secureTextEntry} key={u.field} value={user[u.field]} onChangeText={t => change(t, u.field)} 
                style={MyStyles.margin} placeholder={u.title} right={<TextInput.Icon icon={u.icon} />} />)}

                <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 }}>
                    <RadioButton
                        value="2"
                        status={user.vaiTro === '2' ? 'checked' : 'unchecked'}
                        onPress={() => setUser({ ...user, vaiTro: '2' })}
                    />
                    <Text>CHUNHATRO (Chủ nhà trọ)</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 }}>
                    <RadioButton
                        value="3"
                        status={user.vaiTro === '3' ? 'checked' : 'unchecked'}
                        onPress={() => setUser({ ...user, vaiTro: '3' })}
                    />
                    <Text>NGUOITHUETRO (Người thuê trọ)</Text>
                </View>

                <TouchableOpacity onPress={handleImagePick}>
                    <Text style={MyStyles.margin}>Chọn ảnh đại diện...</Text>
                </TouchableOpacity>
                {images.map((image, index) => (
                          <Image key={index} source={{ uri: image.uri }} style={{ width: 100, height: 100 }} />
                        ))}


                <Button loading={loading} mode="contained" onPress={register}>ĐĂNG KÝ</Button>
            </KeyboardAvoidingView>
        </View>
    );
}

export default Register;