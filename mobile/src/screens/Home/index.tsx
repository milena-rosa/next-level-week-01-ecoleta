import React, { useEffect, useState } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { Image, View, ImageBackground, StyleSheet, Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import PickerSelect from 'react-native-picker-select';
import axios from 'axios';

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const Home = () => {
  const navigation = useNavigation();

  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedUf, setSelectedUf] = useState("0");
  const [selectedCity, setSelectedCity] = useState("0");
  
  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
      )
      .then((response) => {
        const ufInitials = response.data.map(uf => uf.sigla);
        setUfs(ufInitials);
      });
  }, []);

  useEffect(() => {
    if (selectedUf === "0") {
      return;
    }

    axios
      .get<IBGECityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
      )
      .then((response) => {
        const cityNames = response.data.map((city) => city.nome);
        setCities(cityNames);
      });
  }, [selectedUf]);
  
  function handleNavigateToPoints() {
    navigation.navigate('Points', {
      uf: selectedUf,
      city: selectedCity,
    });
  }

  function handleSelectUf(value: string) {
    setSelectedUf(value);
  }

  function handleSelectCity(value: string) {
    setSelectedCity(value);
  }

  return (
    <ImageBackground 
      source={require('../../assets/home-background.png')} 
      imageStyle={{ height: 368, width: 274 }} 
      style={styles.container}
    >
    
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
      </View>

      <View style={{ height: 110, justifyContent: 'space-between' }}>
        <PickerSelect 
          style={pickerSelectStyles}
          placeholder={{
            label: 'Selecione uma UF',
            value: null,
            color: '#666'
          }}
          onValueChange={value => handleSelectUf(value)}
          items={ ufs.map(uf => {
            return {
              label: uf,
              value: uf
            };
          })}
        />

        <PickerSelect
          style={pickerSelectStyles}
          placeholder={{
            label: 'Selecione uma Cidade',
            value: null,
            color: '#666'
          }}
          onValueChange={value => handleSelectCity(value)}
          items={ cities.map(city => {
            return {
              label: city,
              value: city
            };
          })}
        />

      </View>
      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handleNavigateToPoints}>
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name="arrow-right" color="#fff" size={24} />
            </Text>
          </View>
          <Text style={styles.buttonText}>
            Entrar
          </Text>
        </RectButton>
      </View>

    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontFamily: 'Ubuntu_700Bold',
    fontSize: 32,
    marginTop: 64,
    maxWidth: 260,
  },

  description: {
    color: '#6c6c80',
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 16,
    maxWidth: 260,
  },

  footer: {
    
  },
  
  button: {
    alignItems: 'center',
    backgroundColor: '#34cb79',
    borderRadius: 10,
    flexDirection: 'row',
    height: 60,
    marginTop: 32,
    overflow: 'hidden',
  },

  buttonIcon: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 60,
    justifyContent: 'center',
    width: 60,
  },

  buttonText: {
    color: '#fff',
    flex: 1,
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
    justifyContent: 'center',
    textAlign: 'center',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    height: 50,
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },
  inputIOS: {
    height: 50,
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },
  viewContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
  },
  placeholder: {
    color: '#666',
    fontSize: 16,
  },
});

export default Home;