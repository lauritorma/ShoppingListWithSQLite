import { useState, useEffect } from 'react';
import { FlatList, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('shoppinglistdb.db');

export default function App() {

  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [shoppinglist, setShoppinglist] = useState([]);


 

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists shoppinglist (id integer primary key not null, amount text, product text);');
    }, null, updateList);
  }, []);

  const saveProduct = () => {
    db.transaction(tx => {
        tx.executeSql('insert into shoppinglist (amount, product) values (?, ?);', [amount, product]);    
      }, null, updateList
    )
  }

  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from shoppinglist;', [], (_, { rows }) =>
      setShoppinglist(rows._array)
      ); 
    });
  }

  const deleteProduct = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from shoppinglist where id = ?;`, [id]);
      }, null, updateList
    )    
  }

  return (
    <View style={styles.container}>
      <TextInput
      style={{marginTop: 100, fontSize: 18, width: 200, borderColor: 'gray', borderWidth: 1, textAlign: 'center'}}
      placeholder='Product'
      onChangeText={(product) => setProduct(product)}
      value={product}
      />
      <TextInput
      style={{marginTop: 5, fontSize: 18, width: 200, borderColor: 'gray', borderWidth: 1, textAlign: 'center'}}
      placeholder='Amount'
      onChangeText={(amount) => setAmount(amount)}
      value={amount}
      />
      <View style={{marginTop: 10}}>
      <Button onPress={saveProduct} title="Save" />
      </View>
      <Text style={{marginTop: 30, fontSize: 20}}>Shopping List</Text>
      <FlatList
        style={{marginLeft : "5%"}}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) =>
        <View style={styles.listcontainer}>
        <Text style={{fontSize: 18}}>{item.product}, {item.amount} </Text>
        <Text style={{fontSize: 18, color: '#0000ff'}} onPress={() => deleteProduct(item.id)}>bought</Text>
        </View>}
        data={shoppinglist}
        
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   backgroundColor: '#fff',
   alignItems: 'center',
   justifyContent: 'center',
  },
  listcontainer: {
   flexDirection: 'row',
   backgroundColor: '#fff',
   alignItems: 'center'
  },
 });