import {View, Platform, StyleSheet, Text,useWindowDimensions} from 'react-native';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import {GlassContainer, GlassView} from 'expo-glass-effect';
import { Ionicons } from '@expo/vector-icons';
import darkMapStyle from './darkMapStyle.json';
import { LinearGradient } from 'expo-linear-gradient';
import GlassedView from "@/components/glass/GlassedView";
import Map  from '../../components/map/Map';
import { Button } from 'react-native';
import SelectReport from '@/components/report/SelectReport';
import Report from '@/components/report/Report';
import {IconSymbol} from "@/components/ui/symbols/IconSymbol";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      
        <GlassContainer spacing={16} style={styles.glassContainer}>
            <GlassedView
                glassEffectStyle="clear"
                isInteractive={true}
                color="FFFFFF20"
                intensity={12}
                tint={"default"}
                style={[styles.glassBox, { marginTop: 16 }]}
            >
                <LinearGradient
                    colors={['#ffffff10', '#ffffff05']}
                    style={StyleSheet.absoluteFillObject}
                />
                <View style={styles.viewContent}>
                    <IconSymbol name="mappin" size={24} color="white" />
                    <Text style={styles.text}>Current Location</Text>
                    <IconSymbol name="person.circle" size={46} color="white" style={{ marginLeft: 'auto' }} />
                </View>
            </GlassedView>
            <GlassedView
                glassEffectStyle="clear"
                isInteractive={false}
                color="4287f590"
                intensity={12}
                tint={"light"}
                style={{right: 30, width: 200, height: 50, top: -20}}
            >
                <Button title={"hallo"}></Button>
            </GlassedView>
        </GlassContainer>
        <View style={styles.containerSelectReport}>
          {/* 

            <SelectReport useScroll={true} scrollViewProps={{showsVerticalScrollIndicator : false}}>
             
          </SelectReport>
          
          */}
          
        </View>
      <Map/>
      </View>

  )
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerSelectReport:{
    position: 'absolute',
    bottom: 0, // Ajustez cette valeur selon la hauteur de votre tab bar
    left: 0,
    right: 0,
    zIndex: 999, // Pour s'assurer qu'il est au-dessus de la carte
  },
    glassContainer: {
        position: 'absolute',
        top: 50,
        left: 0,
        width: '100%',
        //justifyContent: 'center',
        alignItems: 'center',
      zIndex: 9999,
    },
  view :{
    height : 300
  },
  font:{
    fontSize : 20,
  },
 
    text: {
        fontSize: 16,
        fontWeight: '600',
        color: 'black',
    },
    glassView: {
        position: 'absolute',
        top: 100,
        left: 50,
        width: 100,
        height: 100,
        borderRadius: 9999,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        zIndex: 10000,
    },
    glassBox: {
        width: 353,
        height: 66,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    viewContent:
    {
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        height: '100%',
        alignSelf: 'flex-start',
        paddingHorizontal: 16,
    },


});
