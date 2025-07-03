import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../config/firebase';

export class DatabaseService {
  // Products
  static async getProducts(limitCount = 20, lastDoc = null) {
    try {
      let q = query(
        collection(db, 'products'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const querySnapshot = await getDocs(q);
      const products = [];
      querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() });
      });

      return products;
    } catch (error) {
      throw new Error('Failed to fetch products');
    }
  }

  static async getProductById(productId) {
    try {
      const docRef = doc(db, 'products', productId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      throw new Error('Failed to fetch product');
    }
  }

  static async getProductsByCategory(category, limitCount = 20) {
    try {
      const q = query(
        collection(db, 'products'),
        where('category', '==', category),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const products = [];
      querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() });
      });

      return products;
    } catch (error) {
      throw new Error('Failed to fetch products by category');
    }
  }

  static async searchProducts(searchTerm, limitCount = 20) {
    try {
      // Note: Firestore doesn't support full-text search natively
      // This is a simple implementation - consider using Algolia or similar for better search
      const q = query(
        collection(db, 'products'),
        where('name', '>=', searchTerm),
        where('name', '<=', searchTerm + '\uf8ff'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const products = [];
      querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() });
      });

      return products;
    } catch (error) {
      throw new Error('Failed to search products');
    }
  }

  // Orders
  static async createOrder(orderData) {
    try {
      const docRef = await addDoc(collection(db, 'orders'), {
        ...orderData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'pending',
      });
      return { id: docRef.id, success: true };
    } catch (error) {
      throw new Error('Failed to create order');
    }
  }

  static async getOrdersByUser(userId) {
    try {
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const orders = [];
      querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
      });

      return orders;
    } catch (error) {
      throw new Error('Failed to fetch orders');
    }
  }

  static async getOrderById(orderId) {
    try {
      const docRef = doc(db, 'orders', orderId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      throw new Error('Failed to fetch order');
    }
  }

  static async updateOrderStatus(orderId, status) {
    try {
      const docRef = doc(db, 'orders', orderId);
      await updateDoc(docRef, {
        status,
        updatedAt: new Date().toISOString(),
      });
      return { success: true };
    } catch (error) {
      throw new Error('Failed to update order status');
    }
  }

  // User Data
  static async getUserData(userId) {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data();
      }
      return null;
    } catch (error) {
      throw new Error('Failed to fetch user data');
    }
  }

  static async updateUserData(userId, updates) {
    try {
      const docRef = doc(db, 'users', userId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
      return { success: true };
    } catch (error) {
      throw new Error('Failed to update user data');
    }
  }

  // Addresses
  static async getUserAddresses(userId) {
    try {
      const q = query(
        collection(db, 'addresses'),
        where('userId', '==', userId),
        orderBy('isDefault', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const addresses = [];
      querySnapshot.forEach((doc) => {
        addresses.push({ id: doc.id, ...doc.data() });
      });

      return addresses;
    } catch (error) {
      throw new Error('Failed to fetch addresses');
    }
  }

  static async addAddress(addressData) {
    try {
      const docRef = await addDoc(collection(db, 'addresses'), {
        ...addressData,
        createdAt: new Date().toISOString(),
      });
      return { id: docRef.id, success: true };
    } catch (error) {
      throw new Error('Failed to add address');
    }
  }

  static async updateAddress(addressId, updates) {
    try {
      const docRef = doc(db, 'addresses', addressId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
      return { success: true };
    } catch (error) {
      throw new Error('Failed to update address');
    }
  }

  static async deleteAddress(addressId) {
    try {
      await deleteDoc(doc(db, 'addresses', addressId));
      return { success: true };
    } catch (error) {
      throw new Error('Failed to delete address');
    }
  }

  // Wishlist
  static async getUserWishlist(userId) {
    try {
      const q = query(
        collection(db, 'wishlist'),
        where('userId', '==', userId)
      );

      const querySnapshot = await getDocs(q);
      const wishlist = [];
      querySnapshot.forEach((doc) => {
        wishlist.push({ id: doc.id, ...doc.data() });
      });

      return wishlist;
    } catch (error) {
      throw new Error('Failed to fetch wishlist');
    }
  }

  static async addToWishlist(userId, productId) {
    try {
      const docRef = await addDoc(collection(db, 'wishlist'), {
        userId,
        productId,
        createdAt: new Date().toISOString(),
      });
      return { id: docRef.id, success: true };
    } catch (error) {
      throw new Error('Failed to add to wishlist');
    }
  }

  static async removeFromWishlist(wishlistItemId) {
    try {
      await deleteDoc(doc(db, 'wishlist', wishlistItemId));
      return { success: true };
    } catch (error) {
      throw new Error('Failed to remove from wishlist');
    }
  }

  // Real-time listeners
  static subscribeToProducts(callback) {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (querySnapshot) => {
      const products = [];
      querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() });
      });
      callback(products);
    });
  }

  static subscribeToUserOrders(userId, callback) {
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (querySnapshot) => {
      const orders = [];
      querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() });
      });
      callback(orders);
    });
  }
}

export default DatabaseService; 