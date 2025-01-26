import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { MyUserContext } from "../../configs/MyUserContext";
import { Button } from "react-native-paper";
import axios from 'axios';

const QuanLyTro = ({ navigation }) => {
  const user = useContext(MyUserContext);
  const [troList, setTroList] = useState([]);

  useEffect(() => {
    if (user && user.vaiTro === 2) {
      axios.get(`https://toquocbinh2102.pythonanywhere.com/tros/?nguoiChoThue=${user.id}`)
        .then(response => {
          setTroList(response.data);
        })
        .catch(error => {
          console.error("Lỗi khi tải danh sách trọ", error);
        });
    }
  }, [user]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Quản lý Trọ</Text>
      
      
      {troList.length > 0 ? (
        troList.map((tro) => (
          <TouchableOpacity
            key={tro.id}
            style={styles.troItem}
            onPress={() => navigation.navigate("ChiTietTro", { troId: tro.id })}
          >
            <Text style={styles.troTitle}>{tro.tenTro}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text>Chưa có trọ nào.</Text>
      )}

  
      <Button mode="contained" onPress={() => navigation.navigate("ThemTro")}>
        Thêm Trọ
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#0288d1",
  },
  troItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  troTitle: {
    fontSize: 16,
    color: "#333",
  },
});

export default QuanLyTro;
