'use strict';
var React = require('react-native');

var {
	StyleSheet,
	TextInput,
	Image,
	View,
	Text
} = React;

var Button = require('../common/button.js');
var Parse = require('parse/react-native').Parse;

var {NativeModules} = require('react-native');
var FBLogin = require('react-native-facebook-login');
var FBLoginManager = NativeModules.FBLoginManager;

var VisibleLoader = require('../../../assets/images/rolling.gif');
var HiddenLoader = require('../../../assets/images/1x1.png');
var Icon = require('react-native-vector-icons/MaterialIcons');

module.exports = React.createClass({
	getInitialState: function(){
		return{
			username: '',
			password: '',
			success: false,
			error: '',
			loader: HiddenLoader
		};
	},
	render: function(){
		var _this = this;
		return (
			<View style={styles.container}>
				<View style={styles.masthead}>
					<Icon name="explore" size={70} color="#fff" />
					<Text style={styles.h1}>explore movies</Text>
				</View>
				<Text style={[styles.fg_white, {alignSelf: 'center'}]}>username</Text>
				<TextInput 
					style={styles.input} 
					value={this.state.username} 
					onChangeText={(text) => this.setState({username: text, error: ''})}
					autoCapitalize={'none'} 
					autoCorrect={false} 
					returnKeyType='next' 
					keyboardType={'email-address'}
				>
				</TextInput>
				<Text style={[styles.fg_white, {alignSelf: 'center'}]}>password</Text>
				<TextInput 
					style={styles.input} 
					value={this.state.password}
					password={true}
					onChangeText={(text) =>this.setState({password: text, error: ''})}
					autoCapitalize={'none'} 
				>
				</TextInput>
				<Button 
					text={'SIGN IN'} 
					onPress={this.onSignInPress}
					onRelaxColor={'#117964'}
					onPressColor={'#08362d'}
				></Button>
				<Text 
					style={styles.signUpMessage} 
					onPress={this.onSignUpPress}
				>
					Don't have an account? Sign up!
				</Text>
				<FBLogin style={{ marginTop: 10, alignSelf: 'center' }}
			        permissions={["email","user_friends"]}
			        onLogin={function(data){
						console.log("Logged in!");
			          	console.log(data);
			          	_this.setState({
			          		username: data.profile.email,
			          		password: data.profile.id,
			          		loader: VisibleLoader
			          	});
			          	
			          	
		          		Parse.User.logIn(_this.state.username, _this.state.password, {
							success: (user) => { 
								console.log('login success'+ JSON.stringify(user, null, 4));
								_this.props.navigator.immediatelyResetRouteStack([{name: 'home'}]);
								// console.log(user); 
							},
							error: (data, error) => {
								var errorText;

								switch(error.code){
									case 101: 	errorText="Invalid username or password."
												break;
									case 100: 	errorText="Unable to connect to the internet."
												break;
									default : 	errorText="Something went wrong."
												break;
								}
								_this.setState({ error: errorText })
								console.log('login error: '+ JSON.stringify(error, null, 4));
								_this.onFacebookAuthSignUp(_this.state.username, _this.state.password);
							}
						});
						_this.setState({
							loader: HiddenLoader
						})
			        }}
			        onLogout={function(){
			          console.log("Logged out.");
			          _this.setState({ user : null });
			        }}
			        onLoginFound={function(data){
			          console.log("Existing login found.");
			          console.log(data);
			          	_this.setState({
			          		username: data.profile.email,
			          		password: data.profile.id,
			          	});
			          	
		          		Parse.User.logIn(_this.state.username, _this.state.password, {
							success: (user) => { 
								console.log('login success'+ JSON.stringify(user, null, 4));
								_this.props.navigator.immediatelyResetRouteStack([{name: 'home'}]);
								// console.log(user); 
							},
							error: (data, error) => {
								var errorText;

								switch(error.code){
									case 101: 	errorText="Invalid username or password."
												break;
									case 100: 	errorText="Unable to connect to the internet."
												break;
									default : 	errorText="Something went wrong."
												break;
								}
								console.log('login error: '+ JSON.stringify(error, null, 4));
								_this.onFacebookAuthSignUp(_this.state.username, _this.state.password);
							}
						});
						_this.setState({
							loader: HiddenLoader
						})
			        }}
			        onLoginNotFound={function(){
			        	console.log("No user logged in.");
			          	_this.setState({ user : null });
			        }}
			        onError={function(data){
			          	console.log("ERROR");
			          	console.log(data);
			        }}
			        onCancel={function(){
			          	console.log("User cancelled.");
			        }}
			        onPermissionsMissing={function(data){
			          	console.log("Check permissions!");
			          	console.log(data);
			        }}
			    />
			    <Text style={styles.errorMessage}>{this.state.error}</Text>
			    <Image source={this.state.loader} style={styles.loader}></Image>
			</View>
		)
	},
	onSignInPress: function(){
		if(this.state.username===""){
			return this.setState({
				error: 'Username is missing.'
			});
		}
		if(this.state.password===""){
			return this.setState({
				error: 'Password is missing.'
			});
		}
		this.setState({
			loader: VisibleLoader
		});

		Parse.User.logIn(this.state.username, this.state.password, {
			success: (user) => { 
				this.props.navigator.immediatelyResetRouteStack([{name: 'home'}]);
				console.log(user); 
			},
			error: (data, error) => {
				var errorText;

				switch(error.code){
					case 101: 	errorText="Invalid username or password."
								break;
					case 100: 	errorText="Unable to connect to the internet."
								break;
					default : 	errorText="Something went wrong."
								break;
				}
				this.setState({
					success: false,
					error: errorText,
					loader: HiddenLoader
				});
				console.log(data, error);
			}
		});
	},
	onSignUpPress: function(){
		//this.props.navigator.push({name: 'signup', data: 'mihir'})
		this.props.navigator.push({name: 'signup'})
	},
	onFacebookAuthSignUp: function(email, id){
		var _this = this;
		
		console.log('inside signup');
		Parse.User.logOut();
		var user = new Parse.User();
		user.set('username', email);
		user.set('password', id);
		console.log('calling api...');
		user.signUp(null, {
			success: (user) => { 
				console.log(user);
				_this.props.navigator.immediatelyResetRouteStack([{name: 'home'}]);
			},
			error: (user, error) => {
				console.log(error);
				_this.setState({ error: error.message }) 
			}
		});		
	}
});

var styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: '#1abc9c'
	},
	masthead: {
		padding: 20,
		alignItems: 'center',
		justifyContent: 'center'
	},
	h1:{
		fontSize: 30,
		color: '#ffffff',
		marginBottom: 20,
	},
	input: {
		padding: 4,
		height: 45,
		fontSize: 22,
		color: '#ffffff',
		marginBottom: 20,
		borderWidth: 1,
		textAlign: 'center'
	},
	errorMessage: {
		color: '#f1c40f',
		marginTop: 10,
		alignSelf: 'center',
		textAlignVertical: 'center',
	},
	logo: {
		width: 60,
		height: 60,
	},
	signUpMessage: {
		color: '#ffffff',
		alignSelf: 'center',
		margin: 15,
		fontSize: 16
	},
	fg_white:{
		color: '#ffffff'
	},
	loader: {
		height: 15,
		width: 15,
		alignSelf: 'center',
	}
});

