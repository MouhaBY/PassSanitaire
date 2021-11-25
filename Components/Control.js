import React, { PureComponent } from 'react'
import { Text, View, StyleSheet, Alert, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native'
import { RNCamera } from 'react-native-camera'
import RNBeep from 'react-native-a-beep'


const initialUserData = {
    firstName :'',
    lastName :'',
    dateOfBirth :'',
    hasCovid :'',
    isDone :'',
    idType :'',
    idNumber :'',
    vaccinType :'',
    vaccin1Date : '',
    vaccin2Date : '',
    hasCovid : '',
    isDone : ''
}


class Control extends PureComponent{

    constructor(props) {
        super(props)
        this.state = {
            barcode : '',
            isFormValid: false,
            showCamera : false,
            showUserData : false,
            userData : initialUserData
        }
    }

    showUserData = user => {
        if (user !== "" ) {
            this.setState({showUserData: false});
            try {
                var thisUser = JSON.parse(user);
                if (thisUser.firstName){
                    RNBeep.beep();
                    this.setState({userData: thisUser});
                    this.setState({showUserData: true});
                }
                else {
                    RNBeep.beep(false)
                    this.setState({showUserData: false});
                    this.setState({userData: initialUserData})
                    Alert.alert('Avertissement', 'Code non identifié')
                }
            }
            catch(err){
                RNBeep.beep(false)
                this.setState({showUserData: false});
                this.setState({userData: initialUserData})
                Alert.alert('Avertissement', 'Code non reconnu')
            }
            this.setState({barcode: ''});
        }
    }

    onBarCodeRead = (e) => { 
        this.setState({barcode: e.data}); 
        this.setState({showCamera:false}); 
        this.showUserData(e.data) ;
    }
    
    handlebarcodeUpdate = barcode => { this.setState({ barcode }) }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.barcode !== prevState.barcode) {
          this.validateForm()
      }
    }

    validateForm = () => {
        if (this.state.barcode !== "") {
            this.setState({isFormValid: true})
        }
        else
            this.setState({isFormValid: false})
    }

    render() {
        return(
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image source={require('../Images/logo.png')} style={styles.yourLogo}/>
                </View>
                {this.state.showCamera &&
                <View style={styles.cameraContainer}>
                    <RNCamera
                        style={styles.preview}
                        captureAudio={false}
                        onBarCodeRead = { this.onBarCodeRead }
                        type={ RNCamera.Constants.Type.back }
                        flashMode={ RNCamera.Constants.FlashMode.auto }
                        ref={ cam => this.camera = cam }
                    />
                </View>}
                <View>
                    <View style={styles.findContainer}>
                        <TouchableOpacity
                            onPress = { () => {
                                this.setState({showUserData: false});
                                this.setState({userData: initialUserData});
                                this.setState({showCamera : !this.state.showCamera});} }
                            style = {styles.symbolContainer}>
                            <Image source={require('../Images/camera.png')} style={styles.openCameraSymbol}/>
                        </TouchableOpacity>
                            <TextInput 
                                value={this.state.barcode} 
                                onChangeText={this.handlebarcodeUpdate} 
                                style={styles.inputContainer} 
                                placeholder="Cliquez ici"
                                autoFocus={true}
                                onFocus={()=>{ this.setState({barcode:''}) }}
                                ref={(input) => { this.firstTextInput = input }}
                                onSubmitEditing={() => { this.showUserData(this.state.barcode) }}
                            />
                            {!this.state.showUserData ? 
                            <TouchableOpacity
                                style = {[styles.VerifyButton, {backgroundColor: !this.state.isFormValid ? '#bdbdbd': '#47B4FE'}]}
                                onPress = {()=>{ this.showUserData(this.state.barcode) }}
                                disabled={!this.state.isFormValid}
                            >
                                <Text style={{color: "white", fontSize:16, margin:0}}>Vérifier</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                style = {[styles.VerifyButton, {backgroundColor: '#bdbdbd'}]}
                                onPress = {()=>{ this.setState({userData: initialUserData}); this.setState({showUserData: false}); }}
                            >
                                <Text style={{color: "white", fontSize:16, margin:0}}>Effacer</Text>
                            </TouchableOpacity>
                            }
                    </View>
                </View>
                <View>
                    {this.state.showUserData &&
                        <View>
                        {this.state.userData.isDone ?
                            <View style={styles.vaccinatedContainer}>
                                <Text style={{color:'white', fontSize:18, fontWeight:"bold"}}>Pass sanitaire valide</Text>
                                <Image source={require('../Images/accept.png')} style={styles.validVaccin}/>
                            </View>
                            : 
                            <View style={styles.NonVaccinatedContainer}>
                                <Text style={{color:'white', fontSize:16, fontWeight:"bold" }}>Vaccination incomplète</Text>
                                <Image source={require('../Images/remove.png')} style={styles.validVaccin}/>
                            </View>
                        }
                        </View>
                    }
                </View>
                <ScrollView>
                {this.state.showUserData &&
                    <View style={styles.personData}>
                        
                            <View>
                                <View style={{flexDirection:"row"}}>
                                    <Text>{'Prénom : '}</Text>
                                    <Text style={{fontWeight:"bold", color:"black"}}>{this.state.userData.firstName}</Text>
                                </View>
                                <View style={{flexDirection:"row"}}>
                                    <Text>{'Nom : '}</Text>
                                    <Text style={{fontWeight:"bold", color:"black"}}>{this.state.userData.lastName}</Text>
                                </View>
                                <View style={{flexDirection:"row"}}>
                                    <Text>{'Date de naissance : '}</Text>
                                    <Text style={{color:"black"}}>{ this.state.userData.dateOfBirth }</Text>
                                </View>
                                {this.state.userData.idType && 
                                    <View style={{flexDirection:"row"}}>
                                        <Text>{"Type d'id : "}</Text>
                                        <Text style={{fontWeight:"bold", color:"black"}}>{this.state.userData.idType && this.state.userData.idType.includes("carte d'identité") ? " CIN " : " Passeport " }</Text>
                                        <Text >{"  N° : "}</Text>
                                        <Text style={{fontWeight:"bold", color:"black"}}>{this.state.userData.idNumber}</Text>
                                    </View>
                                }
                            </View>
                        
                    </View>}
                    <View style={styles.descriptionContainer}>
                        <Text style={styles.titleContainer}>{'Informations de vaccination'}</Text>
                        {this.state.showUserData &&
                            <View>
                                <View style={{flexDirection:"row"}}>
                                    <Text>{"A attrapé le COVID : "}</Text>
                                    <Text style={{fontWeight:"bold", color:"black"}}>{this.state.userData.hasCovid ? " Oui " : " Non "  }</Text>
                                </View>
                                <View style={{flexDirection:"row"}}>
                                    <Text>{"A terminé sa vaccination : "}</Text>
                                    <Text style={{fontWeight:"bold", color:"black"}}>{this.state.userData.isDone ? " Oui " : " Non " }</Text>
                                </View>
                                <Text>{"Type du vaccin :  " + this.state.userData.vaccinType }</Text>
                                <View style={{flexDirection:"row"}}>
                                    <Text>{"Date de la 1 ere dose : "}</Text> 
                                    {
                                        this.state.userData.vaccin1Date && 
                                        <Text>{ this.state.userData.vaccin1Date.substring(0,10) }</Text>                                
                                    }                               
                                </View>
                                <View style={{flexDirection:"row"}}>
                                    <Text>{"Date de la 2 eme dose : "}</Text> 
                                    {
                                        this.state.userData.vaccin2Date && 
                                        <Text>{ this.state.userData.vaccin2Date.substring(0,10) }</Text>                                
                                    }                               
                                </View>
                            </View>
                        }
                    </View>
                    <Text style={{color:"black",}}>Scantech passSanitaire© 2021</Text>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding:5,
    },
    cameraContainer:{
        height:250, 
        alignItems:'center' 
    },
    preview:{
        height: 270,
        width: "100%",
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    findContainer:{
        flexDirection:'row',
        margin: 5
    },
    symbolContainer:{
        height:40, 
        justifyContent:'center', 
        alignItems:'flex-start', 
        flexDirection:'row'
    },
    openCameraSymbol:{
        height:50, 
        width:50, 
        resizeMode: 'stretch', 
        marginRight:5
    },
    logoContainer:{
        justifyContent:'center', 
        alignItems:'center',
        margin: 8,
    },
    validVaccin:{
        height:30, 
        width:30, 
        resizeMode: 'stretch', 
        margin:5
    },
    yourLogo:{
        resizeMode: 'contain',
        width: 150,
        height: 60
    },
    VerifyButton:{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#47B4FE',
        height: 50,
        width : 70,
        margin:0,
        padding:0,
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
    },
    inputContainer: {
        alignItems: 'center',
        fontSize: 16,
        paddingLeft: 12,
        justifyContent: 'center',
        borderColor: 'lightgray',
        backgroundColor:'white',
        borderWidth: 1,
        borderRightWidth: 0,
        padding: 8,
        flex:1,
        height: 50,
        borderTopLeftRadius:25,
        borderBottomLeftRadius:25
    },
    vaccinatedContainer:{
        marginTop:5, 
        padding: 5, 
        backgroundColor:'#A2E62E',
        borderRadius: 5,
        flexDirection:"row",
        alignItems:"center",
        justifyContent:'center'
    },
    NonVaccinatedContainer:{
        marginTop:5, 
        padding: 5, 
        backgroundColor:'#F44336',
        //borderColor:"#F44336",
        //borderWidth:1,
        borderRadius: 5,
        flexDirection:"row",
        alignItems:"center",
        justifyContent:'center'
    },
    descriptionContainer:{
        marginTop:5, 
        padding: 5, 
        backgroundColor:'white',
        borderRadius: 5
    },
    personData:{
        marginTop:5, 
        padding: 5, 
        backgroundColor:'#CBE2FF',
        borderRadius: 5
    },
    titleContainer:{
        fontSize:16, 
        fontWeight:'bold', 
        marginBottom:5
    }
})
  

export default Control