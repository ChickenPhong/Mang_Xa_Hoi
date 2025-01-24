import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { Avatar, ListItem } from "react-native-elements";
import { Title, Subheading } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from 'react-native-vector-icons';  // Cài đặt biểu tượng kính lúp
import APIs, { endpoints } from "../../configs/APIs";



const Home = () => {
  const [baidangs, setBaidangs] = useState([]);
  const [filteredBaidangs, setFilteredBaidangs] = useState([]);
  const [filterType, setFilterType] = useState(''); // 'Cho thuê' or 'Tìm phòng' or '' (all)
  const navigation = useNavigation();

  const loadBaidangs = async () => {
    try {
      const res = await APIs.get(endpoints["baidangs"]);
      const reversedData = res.data.reverse();  // Đảo ngược thứ tự để bài đăng mới nhất ở trên
      setBaidangs(reversedData);
      setFilteredBaidangs(reversedData); // Mặc định hiển thị tất cả bài đăng
    } catch (error) {
      console.error("Error loading posts:", error);
    }
  };

  useEffect(() => {


    loadBaidangs();


  }, []);

  useEffect(() => {
    // Lọc bài đăng khi thay đổi bộ lọc
    if (filterType) {
      const filtered = baidangs.filter(b => {
        // Kiểm tra vai trò của người đăng để lọc theo "Tìm phòng" hoặc "Cho thuê"
        if (filterType === "Cựu Sinh Viên") {
          return b.nguoiDangBai.vaiTro === 3;  // Vai trò 3: Tìm phòng
        }
        if (filterType === "Giảng Viên") {
          return b.nguoiDangBai.vaiTro === 2;  // Vai trò 2: Cho thuê phòng
        }
        return false;
      });
      setFilteredBaidangs(filtered);
    } else {
      setFilteredBaidangs(baidangs); // Hiển thị tất cả bài đăng nếu không có bộ lọc
    }
  }, [filterType, baidangs]);

  const getTagByVaiTro = (vaiTro) => {
    if (vaiTro === 1) {
      return "Quản trị viên"; // Vai trò 1: Quản trị viên
    }
    if (vaiTro === 2) {
      return "Giảng Viên"; // Vai trò 2: Cho thuê phòng
    }
    if (vaiTro === 3) {
      return "Cựu Sinh Viên"; // Vai trò 3: Tìm phòng
    }
    return ""; // Không có tag nếu không phải vai trò 1, 2 hoặc 3
  };

  const getTagStyle = (vaiTro) => {
    if (vaiTro === 1) {
      return styles.adminTag; // Style cho Quản trị viên
    }
    if (vaiTro === 2) {
      return styles.rentTag; // Style cho Cho thuê phòng (sẽ có màu đỏ)
    }
    if (vaiTro === 3) {
      return styles.findRoomTag; // Style cho Tìm phòng
    }
    return {}; // Không có style nếu không phải vai trò 1, 2 hoặc 3
  };

  return (
    <View style={styles.container}>
      {/* View chứa biểu tượng kính lúp và tiêu đề */}

      {/* Các nút lọc */}
      <View style={styles.filterContainer}>
        <Button
          title="Cựu Sinh Viên"
          onPress={() => setFilterType("Cựu Sinh Viên")}
          color={filterType === "Cựu Sinh Viên" ? "#0288d1" : "#ccc"}
        />
        <Button
          title="Giảng Viên"
          onPress={() => setFilterType("Giảng Viên")}
          color={filterType === "Giảng Viên" ? "#0288d1" : "#ccc"}
        />
        <Button
          title="Tất cả"
          onPress={() => setFilterType("")}
          color={filterType === "" ? "#0288d1" : "#ccc"}
        />
      </View>

      {filteredBaidangs.length === 0 ? (
        <Text>Không có bài đăng với loại này.</Text>
      ) : (
        filteredBaidangs.map((b) => (
          <ListItem
            key={b.id}
            bottomDivider
            onPress={() => navigation.navigate("ChiTietBaiDang", { baiDang: b })}
          >
            <Avatar
              rounded
              size="medium"
              source={{ uri: b.nguoiDangBai.image }}
            />
            <ListItem.Content>
              <View style={styles.postHeader}>
                <Title>{b.nguoiDangBai.last_name} {b.nguoiDangBai.first_name}</Title>
                <Text style={getTagStyle(b.nguoiDangBai.vaiTro)}>
                  {getTagByVaiTro(b.nguoiDangBai.vaiTro)}
                </Text>
              </View>
              <Subheading style={styles.subtitle}>{b.tieuDe}</Subheading>
              <Text style={styles.date}>
                Ngày đăng: {new Date(b.created_date).toLocaleString("vi-VN")}
              </Text>
            </ListItem.Content>
          </ListItem>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 10,
  },
  header: {
    flexDirection: "row",  // Đặt kính lúp và tiêu đề theo chiều ngang
    alignItems: "center",  // Căn giữa theo chiều dọc
    justifyContent: "space-between",  // Đảm bảo kính lúp và tiêu đề không bị đè lên nhau
    marginBottom: 15,  // Khoảng cách dưới header
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,  // Giúp tiêu đề "Bài đăng" chiếm hết không gian trống
  },
  searchIcon: {
    marginRight: 10,  // Đảm bảo khoảng cách giữa kính lúp và tiêu đề
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  subtitle: {
    color: "#555",
    marginTop: 5,
  },
  date: {
    color: "#888",
    fontSize: 12,
    marginTop: 5,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  findRoomTag: {
    backgroundColor: "#0288d1",  // Màu xanh dương
    color: "white",
    padding: 5,
    borderRadius: 5,
    fontSize: 12,
  },
  rentTag: {
    backgroundColor: "#d32f2f",  // Màu đỏ cho Cho thuê phòng
    color: "white",
    padding: 5,
    borderRadius: 5,
    fontSize: 12,
  },
  adminTag: {
    backgroundColor: "#0288d1",  // Màu xanh dương cho Quản trị viên
    color: "white",
    padding: 5,
    borderRadius: 5,
    fontSize: 12,
  },
});

export default Home;
