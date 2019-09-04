/*
 *
 * Copyright © 2019 Yokesh Thirumoorthi.
 *
 * [This program is licensed under the "MIT License"]
 * Please see the file LICENSE in the source
 * distribution of this software for license terms.
 *
 */

const utils = require('./utils');
const dgraph = require('./dgraph');
// const _ = require('lodash');
// const moment = require('moment');

// function generateFolderStructureByExif(exifJson) {
//     // const otherPhotos = exifJson.all[0].photos.filter(photo => photo.exif.create_on === '');
//     const photos = exifJson.all[0].photos;

//     console.log("exifjson", exifJson);


//     const photosWithExif = photos.map(photo => {
//         console.log("photo:", photo);
//         if (!photo.exif) {
//             return {name: photo.name, date: ''}
//         }
//         return {name: photo.name, date: photo.exif[0].create_on} 
//     });
    
//     console.log("PHotoswithexif", photosWithExif);

//     var groupedResults = _.groupBy(photosWithExif, function (result) {
//         return moment(result.date).format("hA");
//     });

//     const albumTags = Object.keys(groupedResults).map(tagName => {
//         const photos = groupedResults[tagName].map(photo => photo.name);
//         return {
//             albumName: 'album2',
//             tagName: tagName,
//             photos: photos
//         }
//     });

//     console.log(groupedResults);

//     const albumFolders = {albums: albumTags};

//     return albumFolders;
// }

function generateFolderStructureByExif(albumDetails) {
    const albumName =  albumDetails.all[0].name; 
    const photos = albumDetails.all[0].photos.map(photo => photo.name);
    const tagName = 'all';
    const albumTag = { albumName, tagName, photos };
    const albumFolders = { albums: [albumTag] };
    return albumFolders; 
}

/**
 * 
 * After the photos are completely uploaded, 
 * the photo-details extraction process
 * is started. This function
 * helps in executing the process by calling 
 * each service in some defined order.
 * @param {*} albumInfo Contains the name of album to be processed
 */
async function organizePhotosByExif(albumName) {
    console.log("Inside organizePhotosByExif");

    const albumDetails = await dgraph.queryData(albumName);

    console.log("Query album: ", albumDetails);

    const folders = generateFolderStructureByExif(albumDetails);
    
    console.log(folders);

    return folders;
}

async function createStaticDirectory(AlbumInfo) {
    console.log('Creating static web directory', AlbumInfo.albumName);
    const exifFolders = await organizePhotosByExif(AlbumInfo.albumName);
    console.log("Organize folders: ", exifFolders);
    await utils.createExifFolders(exifFolders)
    await utils.generateStaticPage(AlbumInfo.albumName);
}

async function createStaticWebDirectory(call, callback) {
    callback(null, await createStaticDirectory(call.request));
}

module.exports = {createStaticWebDirectory}