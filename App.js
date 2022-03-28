import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { Button, Text, Icon, Input, Header, ListItem } from'react-native-elements';

const db = SQLite.openDatabase('itemdb.db');

export default function App() {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists item (id integer primary key not null, amount text, name text);');
    }, null, updateList); 
  }, []);

  // Save item
  const saveItem = () => {
    db.transaction(tx => {
        tx.executeSql('insert into item (amount, name) values (?, ?);', [amount, name]);    
      }, null, updateList
    )
  }

  // Update itemlist
  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from item;', [], (_, { rows }) =>
        setItems(rows._array)
      ); 
    });
  }

  // Delete item
  const deleteItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from item where id = ?;`, [id]);
      }, null, updateList
    )    
  }

  const listSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: "80%",
          backgroundColor: "#fff",
          marginLeft: "10%"
        }}
      />
    );
  };
  

  return (
    <View style={styles.container}>
      <Header  
        centerComponent={{ text: 'SHOPPING LIST', style: { color: '#ffffff', padding: 10}}}
      />
      <Input 
        placeholder='Product'
        onChangeText={(name) => setName(name)}
        value={name}
        label="PRODUCT"
      /> 
      <Input 
        placeholder='Amount'
        onChangeText={(amount) => setAmount(amount)}
        value={amount}
        label="AMOUNT"
      />      
      <Button 
        style={styles.button}
        onPress={saveItem} 
        title="  SAVE"
        buttonStyle={{
          width:220
        }}
        icon={
          <Icon
            name="save"
            color="white"
          />
        }
      /> 
      <FlatList 
        style={styles.listcontainer}
        keyExtractor={item => item.id.toString()} 
        renderItem={({item}) => 
          <ListItem bottomDivider>
            <ListItem.Content>
              <View style={styles.listitems}>
                <View style={styles.listnames}>
                  <ListItem.Title>{item.name}</ListItem.Title>
                  <ListItem.Subtitle>{item.amount}</ListItem.Subtitle>
                </View>
                <View style={styles.deletebutton}>
                  <ListItem button onPress={() => 
                    {deleteItem(item.id)}}>
                    <Icon name="delete" size={20} color='red' />
                  </ListItem>
                </View>
              </View>
            </ListItem.Content>
          </ListItem>
        } 
        data={items} 
        ItemSeparatorComponent={listSeparator} 
      /> 
    </View>
  );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: '#fff',
  alignItems: 'center',
 },
 listcontainer: {
  paddingTop:10,
  backgroundColor: '#fff',
  width:300,
 },
 listitems:{
   flexDirection:'row',
 },
 listnames:{
  paddingTop:5,
  width:220,
  paddingBottom:5
 },
 deletebutton:{ 
 }


});