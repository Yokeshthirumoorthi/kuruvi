import React, {Component} from 'react';
import Dropzone from 'react-dropzone';
import axios from 'axios';

class FileUploader extends Component {
  constructor() {
    super();
    this.onDrop = (files) => {
      this.setState({files})
    };
    this.state = {
      files: []
    };
    this.handleUploadImage = this.handleUploadImage.bind(this);
  }

  handleUploadImage(ev) {
    ev.preventDefault();

    const data = new FormData();
    data.append('file', this.state.files[0]);
    data.append('filename', this.state.files[0].name);


    console.log("Data: ", data);
    axios.post('http://192.168.1.100:8000/upload', data)
      .then(function (response) {
        console.log(response);
    // this.setState({ imageURL: `http://localhost:8000/${body.file}`, uploadStatus: true });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    const files = this.state.files.map(file => (
      <li key={file.name}>
        {file.name} - {file.size} bytes
      </li>
    ));

    return (
      <Dropzone onDrop={this.onDrop}>
        {({getRootProps, getInputProps}) => (
          <section className="container">
            <div {...getRootProps({className: 'dropzone'})}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
            <div className="container">
                    <form onSubmit={this.handleUploadImage}>
                      <div className="form-group">
                        <input className="form-control"  ref={(ref) => { this.uploadInput = ref; }} type="file" />
                      </div>

                      <button className="btn btn-success" type="submit">Upload</button>
                    </form>
            </div>
            <aside>
              <h4>Files</h4>
              <ul>{files}</ul>
            </aside>
          </section>
        )}
      </Dropzone>
    );
  }
}

export default FileUploader;
