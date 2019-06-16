import React, { Component } from 'react';
import api from '../services/api';
import io from 'socket.io-client';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import camera from '../assets/camera.png';
import more from '../assets/more.png';
import like from '../assets/like.png';
import comment from '../assets/comment.png';
import send from '../assets/send.png';


export default class Feed extends Component {

  static navigationOptions = ({ navigation }) => ({
    headerLeft: (
      <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => navigation.navigate('New')}>
        <Image source={camera} style={{ height: 25, width: 27, maxHeight: '100%' }} />
      </TouchableOpacity>
    ),
  });


  state = {
    feed: [],

  };

  /* Método chamado quando o component é construido */
  async componentDidMount() {
    this.registerToSocket();

    /* Chamada das postagens constantes no BD */
    const response = await api.get('posts');
    /* Atribui na variavel feed do state a resposta do servidor. Consequentemente as
    informações serão trazidas na tela */
    console.log(response.data);
    this.setState({ feed: response.data });

  }

  registerToSocket = () => {
    const socket = io('http://192.168.0.113:3333');
    socket.on('post', newPost => {
      this.setState({ feed: [newPost, ...this.state.feed] })
    });
    socket.on('like', likedPost => {
      this.setState({
        feed: this.state.feed.map(post =>
          post._id === likedPost._id ? likedPost : post
        )
      })
    });
  }

  handleLike = id => {
    api.post(`/posts/${id}/like`);
  };

  

  render() {
    return <View style={styles.container}>
      <FlatList data={this.state.feed}
        keyExtractor={post => post._id}
        renderItem={({ item }) => (
          <View style={styles.feedItem}>
            <View style={styles.feedItemHeader}>
              <View style={styles.userInfo}>
                <Text style={styles.name}>{item.author}</Text>
                <Text style={styles.place}>{item.place}</Text>
              </View>
              <Image source={more} />
            </View>
            <Image source={{ uri: `http://192.168.0.113:3333/files/${item.image}` }}  style={styles.feedImage} />
            <View style={styles.feedItemFooter}>
              <View style={styles.actions}>
                <TouchableOpacity style={styles.action} onPress={() => { this.handleLike(item._id) }}>
                  <Image source={like} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.action} onPress={() => { }}>
                  <Image source={comment} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.action} onPress={() => { }}>
                  <Image source={send} />
                </TouchableOpacity>
              </View>
              <Text style={styles.likes}>{item.likes} curtidas</Text>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.hashtags}>{item.hashtags}</Text>
            </View>

          </View>

        )} />
    </View>;
  }
}


const styles = StyleSheet.create({
  container: {
    //Para ocupar toda a largura/altura da tela
    flex: 1,


  },

  feedItem: {
    marginTop: 20,
  },

  feedItemHeader: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  name: {
    fontSize: 14,
    color: '#000',

  },

  place: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },

  feedImage: {
    width: '100%',
    height: 500,
    marginVertical: 15,
  },

  feedItemFooter: {
    paddingHorizontal: 15,
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  action: {
    marginRight: 15,
  },

  likes: {
    marginTop: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  description: {
    lineHeight: 18,
    color: '#000',
  },
  hashtags: {
    color: '#000080',
  }



});




