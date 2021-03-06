var React = require('react-native');
var {
	RefreshControl,
	StyleSheet,
	ScrollView,
	ListView,
	Image,
	View,
	Text,
} = React;

var API = require('../../common/api');
var MovieItem = require('../../common/MovieItemIOS');
var Icon = require('react-native-vector-icons/Ionicons');

var VisibleLoader = require('../../../../assets/images/default.gif');
var HiddenLoader = require('../../../../assets/images/1x1.png');


module.exports = React.createClass({

	getInitialState: function(){
    	return {
        	rawData: [],
	        dataSource: new ListView.DataSource({
    	      rowHasChanged: (row1, row2) => row1 !== row2
        	}),
	        loaded: false,
    	    isRefreshing: false,
        	page: 1,
          loader: HiddenLoader
		}
	},
	componentDidMount: function(){
    	//this.reloadData();
    	setTimeout(this.reloadData, 2000);
  	},
  	fetchData: function(page){
      this.setState({loader: VisibleLoader})
      console.log(page + ' inside fetchData');
      API.getUpcomingMovies(page)
        .then((data) => {
          this.setState({
            rawData: this.state.rawData.concat(data),
            dataSource: this.state.dataSource.cloneWithRows(this.state.rawData.concat(data)),
            loaded: true,
            loader: HiddenLoader
          });
        });
    },
  	reloadData: function(){
    	this.setState({ isRefreshing: true, rawData: [], page: 1 });
    	console.log(this.state.page + ' inside reloadData');
    	API.getUpcomingMovies(this.state.page)
      		.then((data) => {
	        	this.setState({
	            rawData: this.state.rawData.concat(data),
    	        dataSource: this.state.dataSource.cloneWithRows(this.state.rawData.concat(data)),
        	    loaded: true,
            	isRefreshing: false
    		});
      	});
  	},
  	loadMoreMovies: function(){
	    var nextPage = this.state.page+1;
    	this.setState({ 
      		page: nextPage
    	});
    	console.log(this.state.page + ' inside loadMoremovies');
    	this.fetchData(nextPage);
  	},	
	render: function(){
		if(!this.state.loaded){
      		return this.renderLoadingView();
    	}
  		return(
        <View style={styles.container}>
				  <ScrollView
            refreshControl={
						  <RefreshControl 
                refreshing={this.state.isRefreshing}
                onRefresh={this.reloadData}
                tintColor="#1abc9c"
						  />
            }
          >
            <ListView 
              dataSource={this.state.dataSource}
              renderRow={this.renderMovie}
              style={styles.listView}
            >
            </ListView> 
            <Text style={styles.loadMoreText} onPress={this.loadMoreMovies}>Load more</Text>
            <View style={styles.loadMoreWrapper}><Image source={this.state.loader} style={styles.loadMoreIndicator}></Image></View>
				  </ScrollView>  		
        </View>
  		);    	
	},
	renderLoadingView: function(){
		return (
      		<View style={styles.container}>
        		<View style={styles.loader}>
          			<Image 
            			source={require('../../../../assets/images/loaderIOS.gif')}
            			style={styles.loaderImage}
          			/>
        		</View>
      		</View>
    	);		
	},
	renderMovie: function(movie){
	    return (
    	    <MovieItem movie={movie} navigator={this.props.navigator} />
    	);
  	},	
});

var styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ffffff',
		paddingTop: 20
	},	
	loader: {
	    flex: 1,
    	justifyContent: 'center',
    	alignItems: 'center',
    	backgroundColor: '#ffffff'
  	},
	loaderImage: {
		width: 200,
    	height: 150
	},	
	loadMoreText: {
		fontSize: 15,
		alignSelf: 'center',
		padding: 20,
	},
  loadMoreWrapper: {
    padding: 10,
    marginBottom: 50
  },
  loadMoreIndicator: {
    height: 30, 
    width: 30,
    alignSelf: 'center'
  }  
})