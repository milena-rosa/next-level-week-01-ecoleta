import React, { useEffect, useState } from 'react'
import { View, Image, Text, StyleSheet, TouchableOpacity, SafeAreaView, Linking } from 'react-native'
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather as Icon, FontAwesome } from '@expo/vector-icons';
import * as MailComposer from 'expo-mail-composer';

import api from '../../services/api';

interface RouteParams {
  point_id: number;
}

interface Point {
  image: string;
  image_url: string;
  name: string;
  email: string;
  whatsapp: string;
  city: string;
  uf: string;
  items: string[];
}

const Detail = () => {
  const [point, setPoint] = useState<Point>({} as Point);
  const navigation = useNavigation();
  const route = useRoute();
  
  const routeParams= route.params as RouteParams;

  useEffect(() => {
    api.get(`points/${routeParams.point_id}`)
      .then(response => {
        setPoint(response.data);
      });
  }, []);

  function handleNavigateBack() {
    navigation.goBack();
  }

  function handleComposeMail() {
    MailComposer.composeAsync({
      subject: 'Interesse na coleta de resíduos',
      recipients: [point.email],
    });
  }

  function handleWhatsapp() {
    Linking.openURL(`whatsapp://send?phone=${point.whatsapp}&text="Tenho interesse em coletar resíduos do tipo ${point.items?.join(', ')}"`);
  }

  if (!point) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name="arrow-left" size={20} color="#34cb79" />
        </TouchableOpacity>

        <Image 
          style={styles.pointImage}
          source={{ uri: point.image_url }} 
        />

        <Text style={styles.pointName}>{point.name}</Text>
        <Text style={styles.pointItems}>
          { point.items?.join(', ') }
        </Text>

        <View style={styles.address}>
          <Text style={styles.addressTitle}>Endereço</Text>
          <Text style={styles.addressContent}>{`${point.city}, ${point.uf}`}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handleWhatsapp}>
          <FontAwesome name="whatsapp" size={20} color="#fff" />
          <Text style={styles.buttonText}>Whatsapp</Text>
        </RectButton>

        <RectButton style={styles.button} onPress={handleComposeMail}>
          <Icon name="mail" size={20} color="#fff" />
          <Text style={styles.buttonText}>E-mail</Text>
        </RectButton>
      </View>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 20,
  },

  pointImage: {
    borderRadius: 10,
    height: 120,
    marginTop: 32,
    resizeMode: 'cover',
    width: '100%',
  },

  pointName: {
    color: '#322153',
    fontFamily: 'Ubuntu_700Bold',
    fontSize: 28,
    marginTop: 24,
  },

  pointItems: {
    color: '#6c6c80',
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
  },

  address: {
    marginTop: 32,
  },

  addressTitle: {
    color: '#322153',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },

  addressContent: {
    color: '#6c6c80',
    fontFamily: 'Roboto_400Regular',
    lineHeight: 24,
    marginTop: 8,
  },

  footer: {
    borderColor: '#999',
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 20,
    paddingHorizontal: 32,
    paddingVertical: 20,
  },

  button: {
    alignItems: 'center',
    backgroundColor: '#34cb79',
    borderRadius: 10,
    flexDirection: 'row',
    height: 50,
    justifyContent: 'center',
    width: '48%',
  },

  buttonText: {
    color: '#fff',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
    marginLeft: 8,
  },
});


export default Detail
