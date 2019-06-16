import React, { Component } from 'react';
import ImagePicker from 'react-native-image-picker';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import api from '../services/api';

export default class New extends Component {
    static navigationOptions = {
        headerTitle: 'Nova Publicação',
    };
    state = {
        image: null,
        author: '',
        place: '',
        description: '',
        hashtags: '',
        preview: null,
    };

    handleSelectImage = () => {
        ImagePicker.showImagePicker({
            title: 'Selecionar Imagem',
            cancelButtonTitle: 'Cancelar',
            takePhotoButtonTitle: 'Tirar uma foto',
            chooseFromLibraryButtonTitle: 'Selecionar da Galeria',
        }, upload => {
            if (upload.error) {
                console.log('Error');
            } else if (upload.didCancel) {
                console.log('Operação cancelada');
            } else {
                const preview = {
                    uri: `data:image/jpeg;base64,${upload.data}`,
                };

                let prefix;
                let ext;

                if (upload.fileName) {
                    [prefix, ext] = upload.fileName.split('.');
                    ext = ext.toLowerCase() === 'heic' ? 'jpg' : ext;
                } else {
                    prefix = new Date().getTime();
                    ext = 'jpg';
                }
                const image = {
                    uri: upload.uri,
                    type: upload.type,
                    name: `${prefix}.${ext}`,

                };
                this.setState({ preview, image });
            }
        })
    }

    handleSubmit = () => {
        const data = new FormData();
        data.append('image', this.state.image);
        data.append('author', this.state.author);
        data.append('place', this.state.place);
        data.append('description', this.state.description);
        data.append('hastags', this.state.hashtags);

        api.post('posts', data);
        /* Para redirecionar para a rota inicial da aplicação */
        this.props.navigation.navigate('Feed');
    }

    render() {
        return <View style={styles.container}>

            <TouchableOpacity style={styles.selectButton} onPress={this.handleSelectImage}>
                <Text style={styles.selectButtonText}>Selecionar Imagem</Text>
            </TouchableOpacity>
            {this.state.preview && <Image style={styles.preview} source={this.state.preview} />}
            <TextInput
                style={styles.input}
                autoCorrect={false}
                autoCapitalize='sentences'
                placeholder='Nome do autor'
                placeholderTextColor='#999'
                value={this.state.author}
                onChangeText={author => this.setState({ author })}
            ></TextInput>
            <TextInput
                style={styles.input}
                autoCorrect={false}
                autoCapitalize='sentences'
                placeholder='Local'
                placeholderTextColor='#999'
                value={this.state.place}
                onChangeText={place => this.setState({ place })}
            ></TextInput>
            <TextInput
                style={styles.input}
                autoCorrect={false}
                autoCapitalize='sentences'
                placeholder='Descrição'
                placeholderTextColor='#999'
                value={this.state.description}
                onChangeText={description => this.setState({ description })}
            ></TextInput>
            <TextInput
                style={styles.input}
                autoCorrect={false}
                autoCapitalize='none'
                placeholder='Hashtags'
                placeholderTextColor='#999'
                value={this.state.hashtags}
                onChangeText={hashtags => this.setState({ hashtags })}
            ></TextInput>
            <TouchableOpacity style={styles.shareButton} onPress={this.handleSubmit}>
                <Text style={styles.shareButtonText}>Compartilhar</Text>
            </TouchableOpacity>
        </View>;
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 30,
    },

    selectButton: {
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#CCC',
        borderStyle: 'dashed',
        height: 42,

        justifyContent: 'center',
        alignItems: 'center',
    },

    selectButtonText: {
        fontSize: 16,
        color: '#666',
    },

    preview: {
        width: 100,
        height: 100,
        marginTop: 10,
        alignSelf: 'center',
        borderRadius: 4,
    },

    input: {
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 15,
        marginTop: 10,
        fontSize: 16,
    },

    shareButton: {
        backgroundColor: '#00008D',
        borderRadius: 4,
        height: 42,
        marginTop: 15,

        justifyContent: 'center',
        alignItems: 'center',
    },

    shareButtonText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#FFF',
    },
});
