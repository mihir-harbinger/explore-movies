var React = require('react-native');

var {
  DrawerLayoutAndroid,
  TouchableHighlight,
  ScrollView,
  StyleSheet,
  TextInput,
  ListView,
  Platform,
  Image,
  Text,
  View
} = React;

var ToolBarOnlyBack = require('../common/ToolbarAndroidOnlyBack');
var ToolbarBeforeLoad = require('../common/ToolbarAndroidBeforeLoad');
var Icon = require('react-native-vector-icons/MaterialIcons');
var API = require('../common/api');

var GenreItem = require('../common/GenreItem');

module.exports = React.createClass({

	getInitialState: function(){
		return{
			dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 != row2
			}),
			loaded: false
		}
	},
	componentDidMount: function(){
		API.getMovieGenres()
			.then((data) => {
				this.setState({ 
					dataSource: this.state.dataSource.cloneWithRows(data),
					loaded: true
				});
				console.log(data);
			});
	},
	render: function(){

		if(!this.state.loaded){
      		return this.renderLoadingView();
    	} 

		return(
			<View style={styles.container}>
				<ToolBarOnlyBack
					title={'Movie Genres'}
				    navigator={this.props.navigator}
				    sidebarRef={this}
				/>
		  		<ScrollView>
		  			<ListView
		  				style={{ flex: 1 }}
		  				dataSource={this.state.dataSource}
		  				renderRow={this.renderMovieGenre}
		  			>
		  			</ListView>
		  		</ScrollView>
			</View>
    	);
	},
  	renderLoadingView: function(){
    	return (
      		<View style={styles.container}>
        		<ToolbarBeforeLoad title="Movie Genres" navIcon={require('../../../assets/images/arrow_back_white_54x54.png')} />
        		<View style={styles.loader}>
	          		<Image 
    	        		source={require('../../../assets/images/load4.gif')}
        	    		style={styles.loaderImage}
          			/>
        		</View>
      		</View>
    	);
  	},	
	renderMovieGenre: function(genre){
		return(
			<GenreItem genre={genre.name}></GenreItem>
		)
	},
});

var styles = StyleSheet.create({
  container: {
	flex: 1,
	backgroundColor: '#091D27'
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#091D27'
  },
  loaderImage: {
    width: 200,
    height: 150
  },
})