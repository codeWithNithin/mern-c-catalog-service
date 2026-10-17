import { v2 as cloudinary } from 'cloudinary'
import config from 'config'
import type { FileData, FileStorage } from '../types/storage.js'

class CloudinaryStorage implements FileStorage {
    constructor() {
        cloudinary.config({
            cloud_name: config.get('cloudinary.cloud_name'),
            api_key: config.get('cloudinary.api_key'),
            api_secret: config.get('cloudinary.api_secret'), // Click 'View API Keys' above to copy your API secret
        })
    }

    async delete(filename: string): Promise<void> {
        await cloudinary.uploader.destroy(filename, {
            resource_type: 'image',
        })
    }

    getObjectUri(filename: string): string {
        return cloudinary.url(filename)
    }

    async upload(data: FileData) {
        await cloudinary.uploader.upload(data.tempFilePath, {
            public_id: data.filename,
            resource_type: 'image',
        })
    }
}

export default CloudinaryStorage
