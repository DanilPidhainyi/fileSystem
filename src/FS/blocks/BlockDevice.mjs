import BlockDevice from "blockdevice";
import {BLOCK_SIZE, NAME_CARRIER_INFORMATION, SIZE_CARRIER_INFORMATION} from "../constants.mjs";


//new BlockDevice( options )
// options: Object
// fs: require( 'fs' ), optional; custom 'fs' instance
// fd: Number, optional; file descriptor
// path: String, optional if fd is given
// mode: String, optional if fd is given
// blockSize: Number, optional
// size: Number, optional
// headsPerTrack: Number, optional
// sectorsPerTrack: Number, optional

// exports.bd = new BlockDevice({})


export const device = {
    device: null,

    initializationBlockDevice(fd) {
        this.device = new BlockDevice({
            path: NAME_CARRIER_INFORMATION,
            size: SIZE_CARRIER_INFORMATION,
            fd: fd,
            blockSize: BLOCK_SIZE
        })
    },


}

// device.open( function( error ) {
//     var from = 0
//     // And determine how many blocks
//     // we have to read, if the block size
//     // is less than 512 bytes
//     var to = device.blockSize < 512 ?
//         512 / device.blockSize : 1
//
//
//     device.readBlocks( from, to, function( error, buffer, bytesRead ) {
//
//         if( error != null )
//             throw error
//
//         // Check if the bytes read correspond to
//         // how many blocks were specified
//         if( bytesRead < ( to - from ) * device.blockSize )
//             //throw new Error( 'Less bytes than specified were read' )
//
//             // And if everything went well, here we have our
//             // Master Boot Record in the first 512 bytes
//             var mbr = buffer.slice( 0, 512 )
//
//         var hex = mbr.toString( 'hex' )
//             .replace( /([0-9a-f]{64})/ig, '$1\n' )
//             .replace( /([0-9a-f]{2})/ig, '$1 ' )
//
//         // Note the magic 0x55 0xAA at the end
//         console.log( hex )
//     })
// })
