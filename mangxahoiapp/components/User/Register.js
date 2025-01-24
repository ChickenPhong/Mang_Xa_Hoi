import { useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from "react-native";
import { Button, HelperText, RadioButton, TextInput  } from "react-native-paper";
import MyStyles from "../../styles/MyStyles";
import * as ImagePicker from 'expo-image-picker';
import APIs, { endpoints } from "../../configs/APIs";
import { useNavigation } from "@react-navigation/native";

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

    const change = (value, field) => {
        setUser({...user, [field]: value});
    }

    const pickImage = async () => {
        // let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        // if (status !== 'granted') {
        //     alert("Permissions denied!");
        // } else {
        //     const result = await ImagePicker.launchImageLibraryAsync();
        //     if (!result.canceled)
        //         change(result.assets[0], 'image');
        // }
        try{
            let result = {};
            await ImagePicker.requestMediaLibraryPermissionsAsync();
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled){
                await change(result.assets[0], 'image')
            }
        } catch (err){
            alert("Lỗi: " + err.message);
        }
    }

    const register = async () => {
        if (user.password !== user.confirm)
            setErr(true);
        else {
            setErr(false);
            let form = new FormData();

            for (let key in user)
                if (key !== 'confirm') {
                    // if (key === 'image') {
                    //     form.append('image', {
                    //         uri: user.image.uri.replace('file://', ''),
                    //         name: user.image.fileName || 'image.jpg',
                    //         type: user.image.type || 'image/jpeg',
                    //     })
                    //     // const formattedImage = formatImage(user.image);
                    //     // form.append(key, formattedImage);
                    // } else
                    form.append(key, user[key]);
                }
            // let form = new FormData();
            // form.append('first_name', "Binh");
            // form.append('last_name', "To");
            // form.append('email', "tqb@gmail.com");
            // form.append('username', "tqbinh123");
            // form.append('password', "123456");
            // form.append('SDT', "0762590966");
            // form.append('vaiTro', "3");

            console.info(form)

            // axios.post('https://toquocbinh2102.pythonanywhere.com/users/', form, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data'
            //     }
            // })
            // .then((respone)=>
            //     console.log(respone)
            // )
            // .catch((error) => {
            //     if (error.response) {
            //         // Server trả về response với mã lỗi (4xx hoặc 5xx)
            //         console.error('Response Error:', error.response.data);
            //     } else if (error.request) {
            //         // Không nhận được response từ server
            //         console.error('No Response:', error.request);
            //     } else {
            //         // Lỗi khác
            //         console.error('Error:', error.message);
            //     }
            // });
                
            setLoading(true);
            try {
                let res = await APIs.post(endpoints['register'], form, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.info(res.data)
                Alert.alert("Đăng ký thành công, mời bạn đăng nhập")
                nav.navigate("login");
            } catch (ex) {
                console.error(JSON.stringify(ex));
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
                        value="3"
                        status={user.vaiTro === '3' ? 'checked' : 'unchecked'}
                        onPress={() => setUser({ ...user, vaiTro: '3' })}
                    />
                    <Text>CUUSINHVIEN (Cựu Sinh Viên)</Text>
                </View>

                {/* <TouchableOpacity onPress={pickImage}>
                    <Text style={MyStyles.margin}>Chọn ảnh đại diện...</Text>
                </TouchableOpacity>


                {user.image ? <Image source={{ uri: user.image.uri }} style={{ width: 100, height: 100 }} /> : ""} */}

                

                <Button loading={loading} mode="contained" onPress={register}>ĐĂNG KÝ</Button>
            </KeyboardAvoidingView>
        </View>
    );
}

export default Register;