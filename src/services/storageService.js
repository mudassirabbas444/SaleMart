import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { storage } from '../config/firebase';

export class StorageService {
  // Upload image
  static async uploadImage(uri, path, fileName) {
    try {
      // Convert URI to blob
      const response = await fetch(uri);
      const blob = await response.blob();

      // Create storage reference
      const storageRef = ref(storage, `${path}/${fileName}`);
      
      // Upload blob
      const snapshot = await uploadBytes(storageRef, blob);
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return {
        url: downloadURL,
        path: snapshot.ref.fullPath,
        success: true
      };
    } catch (error) {
      throw new Error('Failed to upload image');
    }
  }

  // Upload multiple images
  static async uploadMultipleImages(images, path) {
    try {
      const uploadPromises = images.map(async (image, index) => {
        const fileName = `image_${Date.now()}_${index}.jpg`;
        return await this.uploadImage(image.uri, path, fileName);
      });

      const results = await Promise.all(uploadPromises);
      return results;
    } catch (error) {
      throw new Error('Failed to upload multiple images');
    }
  }

  // Upload product image
  static async uploadProductImage(uri, productId) {
    try {
      const fileName = `product_${productId}_${Date.now()}.jpg`;
      return await this.uploadImage(uri, 'products', fileName);
    } catch (error) {
      throw new Error('Failed to upload product image');
    }
  }

  // Upload user profile image
  static async uploadProfileImage(uri, userId) {
    try {
      const fileName = `profile_${userId}_${Date.now()}.jpg`;
      return await this.uploadImage(uri, 'profiles', fileName);
    } catch (error) {
      throw new Error('Failed to upload profile image');
    }
  }

  // Get download URL
  static async getDownloadURL(path) {
    try {
      const storageRef = ref(storage, path);
      return await getDownloadURL(storageRef);
    } catch (error) {
      throw new Error('Failed to get download URL');
    }
  }

  // Delete file
  static async deleteFile(path) {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
      return { success: true };
    } catch (error) {
      throw new Error('Failed to delete file');
    }
  }

  // Delete multiple files
  static async deleteMultipleFiles(paths) {
    try {
      const deletePromises = paths.map(path => this.deleteFile(path));
      await Promise.all(deletePromises);
      return { success: true };
    } catch (error) {
      throw new Error('Failed to delete multiple files');
    }
  }

  // List files in directory
  static async listFiles(path) {
    try {
      const storageRef = ref(storage, path);
      const result = await listAll(storageRef);
      
      const files = [];
      for (const item of result.items) {
        const url = await getDownloadURL(item);
        files.push({
          name: item.name,
          path: item.fullPath,
          url: url
        });
      }

      return files;
    } catch (error) {
      throw new Error('Failed to list files');
    }
  }

  // Generate unique filename
  static generateFileName(originalName, prefix = '') {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split('.').pop();
    return `${prefix}${timestamp}_${randomString}.${extension}`;
  }

  // Validate image file
  static validateImage(file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.');
    }

    if (file.size > maxSize) {
      throw new Error('File size too large. Maximum size is 5MB.');
    }

    return true;
  }

  // Compress image before upload (basic implementation)
  static async compressImage(uri, quality = 0.8) {
    try {
      // This is a basic implementation
      // For better image compression, consider using react-native-image-manipulator
      return uri;
    } catch (error) {
      throw new Error('Failed to compress image');
    }
  }
}

export default StorageService; 