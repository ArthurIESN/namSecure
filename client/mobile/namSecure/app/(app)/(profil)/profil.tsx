import {View, Text, StyleSheet, Image, Dimensions, TouchableOpacity} from "react-native";
import Map from "@/components/map/Map";
import {useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {useAuth} from "@/provider/AuthProvider";
import {IAuthUserInfo} from "@/types/context/auth/auth";
import {BlurView} from "expo-blur";
import {IconSymbol} from "@/components/ui/symbols/IconSymbol";
import UpdateMemberForm from "@/components/forms/updateMemberForm";


const {width} = Dimensions.get("window");

type TabType = 'profil' | 'groups' | 'update';

export default function ProfilPage() {
    const {user} : {user: IAuthUserInfo} = useAuth()
    const [activeTab, setActiveTab] =  useState<TabType>('profil');
    const [updateTab, setUpdateTab] = useState<boolean>(false);

    console.log("Ceci est l'image : ",user.photoPath);
    console.log(user.photoName);
    const tabs = [
        {id: 'profil', title: 'My profil'},
        {id: 'groups', title: 'Groups'},
    ];

    console.log(updateTab);

    const renderContent = () => {
        if(activeTab === 'profil'){
            if(updateTab){
                return (
                    <View style={{width: width * 0.8}}>
                        <View style={{width:'100%'}}>
                            <TouchableOpacity onPress={() => setUpdateTab(false)}>
                                <IconSymbol name={"chevron.left"} size={25} color={"black"}></IconSymbol>
                            </TouchableOpacity>
                            <UpdateMemberForm></UpdateMemberForm>
                        </View>
                    </View>

                )
            }
            return (
                <View>
                    <View style={{backgroundColor: 'white', padding: 20, borderRadius: 10, width: width * 0.8}}>
                        <Text style={{fontWeight:'bold'}}>Email</Text>
                        <Text style={{paddingTop:5, color:'#797979'}}>{user.email}</Text>
                        <Text style={{fontWeight:'bold', paddingTop:15}}>Address</Text>
                        <Text style={{paddingTop:5}}>{user.address}</Text>
                    </View>

                    <TouchableOpacity style={{
                        width: 'auto',
                        borderRadius:5,
                        height:35,
                        justifyContent:'center',
                        backgroundColor:'white',
                        marginTop:10,
                    }}
                                      key={'update'}
                                      onPress={() => setUpdateTab(true)}
                    >
                        <Text style={{paddingLeft:10}}>Edit my profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{
                        width: 'auto',
                        borderRadius:5,
                        height:35,
                        justifyContent:'center',
                        backgroundColor:'#EE5C63',
                        opacity:0.85,
                        marginTop:10,
                    }}>
                        <Text style={{paddingLeft:10}}>Log Out</Text>
                    </TouchableOpacity>
                </View>

            );
        }else {
            return (
                <View>
                    <Text>Groups content goes here</Text>
                </View>
            );
        }
    }


    return (
        <View style={styles.container}>
            <BlurView intensity={25} style={styles.backgroundMap}>
                <Map
                    isBackground={true}
                    style={styles.backgroundMap}
                />
            </BlurView>
            <SafeAreaView style={styles.content}>
                <Image
                    style={{marginTop : 20,width: 225, height: 225, borderRadius: 112.5}}
                    source={{uri: user.photoPath}}
                />
                <Text style={{marginTop : 15, fontWeight: "bold"}}>{user.firstName} {user.lastName}</Text>

                <View style={{
                    flexDirection: 'row',
                    width : '80%',
                    borderBottomWidth: 2,
                    borderBottomColor: '#E0E0E0',
                }}>
                    {
                        tabs.map(tab => (
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    paddingVertical: 15,
                                    borderBottomWidth: 2,
                                    borderBottomColor: activeTab === tab.id ? '#0088FF' : 'transparent',
                                    marginBottom: -2
                                }}
                                key={tab.id}
                                onPress={() => setActiveTab(tab.id as TabType)}
                            >
                                <Text style={{
                                    fontWeight: activeTab === tab.id ? "bold" : "normal"
                                }}>
                                    {tab.title}
                                </Text>
                            </TouchableOpacity>
                        ))
                    }
                </View>



                <View style={{marginTop : 20}}>
                    {renderContent()}
                </View>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundMap: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 1,
        zIndex: -1,
    },

    content :  {
        flex : 1,
        alignItems: 'center',
    }

});

