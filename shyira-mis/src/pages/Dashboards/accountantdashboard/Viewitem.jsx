import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddItemForm from './AddItem';

const ViewItems = () => {
  const [items, setItems] = useState([]);
  const [itemToEdit, setItemToEdit] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/items');
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, []);

  const handleEditClick = (item) => {
    setItemToEdit(item);
  };

  const handleDeleteClick = async (itemId) => {
    try {
      await axios.delete(`http://localhost:5000/api/items/${itemId}`);
      setItems(items.filter((item) => item._id !== itemId));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleUpdateItem = (updatedItem) => {
    setItems(items.map((item) => (item._id === updatedItem._id ? updatedItem : item)));
    setItemToEdit(null);
  };

  const handleAddItem = (newItem) => {
    setItems([...items, newItem]);
  };

  const handleCancelEdit = () => {
    setItemToEdit(null);
  };

  return (
    <div className="view-items">
      <h2>Items List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Category</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>{item.category}</td>
              <td>{item.price}</td>
              <td>
                <button onClick={() => handleEditClick(item)}>Edit</button>
                <button onClick={() => handleDeleteClick(item._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {(itemToEdit &&

        <AddItemForm 
        itemToEdit={itemToEdit} 
        onUpdateItem={handleUpdateItem} 
        onAddItem={handleAddItem} 
        onCancelEdit={handleCancelEdit} 
      />
      )}
      
    </div>
  );
};

export default ViewItems;
