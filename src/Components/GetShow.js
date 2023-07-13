// GetShow.js
"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.css';
import { axiosapi } from './Auth';
import Link from 'next/link';
import './posts.css';
import './show.css';
import { Button, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import kod from '../app/images/kod.jpg';
import Image from 'next/image';
import logo from '../app/images/Logo.png';

function GetShow() {
  const [post, setPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const { id, category } = router.query;
  const [selectedCategory, setSelectedCategory] = useState(category || '');
  const [categoryPosts, setCategoryPosts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  useEffect(() => {
    setSelectedCategory(category || '');
  }, [category]);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        await fetchPost();
      }
      if (selectedCategory) {
        await fetchCategoryPosts();
      }
    };

    fetchData();
  }, [id, selectedCategory]);

  const fetchPost = async () => {
    setCategoryPosts([]); // Kategori gönderilerini sıfırla
  
    try {
      const response = await axiosapi.get(`http://127.0.0.1:8000/api/detail/${id}`);
      console.log(response.data);
      setPost(response.data);
  
      if (response.data.categoryId) {
        const categoryId = response.data.categoryId;
        const categoryResponse = await axiosapi.get('http://127.0.0.1:8000/api/posts', {
          params: { page: 1, perPage: 10, category: categoryId },
        });
        setCategoryPosts(categoryResponse.data.data);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosapi.get('http://127.0.0.1:8000/api/get-categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const fetchCategoryPosts = async () => {
    try {
      const response = await axiosapi.get('http://127.0.0.1:8000/api/posts', {
        params: { page: 1, perPage: 10, category: selectedCategory },
      });
      setCategoryPosts(response.data.data);
    } catch (error) {
      console.error('Error fetching category posts:', error);
    }
  };
  

  const handleEdit = async (updatedData) => {
    try {
      await axiosapi.post(`http://127.0.0.1:8000/api/update/${id}`, updatedData);
      console.log('Post edited');
      setPost(updatedData);
      setIsEditing(false);
      Swal.fire({
        icon: 'success',
        text: 'Gönderi başarıyla kaydedildi.',
      });
      handleToggleModal(); // Modal'ı kapat
    } catch (error) {
      console.error('Error editing post:', error);
    }
  };

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleToggleModal = () => {
    setShowModal(!showModal);
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  const handleGoBack = () => {
    router.push('/posts');
  };

  const handleCategoryClick = async (categoryId) => {
    setSelectedCategory(categoryId);
    sessionStorage.setItem('selectedCategory', categoryId);
    router.push(`/posts?category=${categoryId}`);
  };
  
  
 
  

  return (
    <div className="container">
      
           <nav className="navbar navbar-expand-lg detail-nav">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <Image src={logo} width={50} height={50} />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <div>
                <a className="nav-link active" aria-current="page" href="/">Home</a>

                </div>
              </li>
              <li className="nav-item">

              <a className="nav-link active" aria-current="page" href="/posts">Posts</a>
              </li>

              
            </ul>
          </div>
        </div>
      </nav>
      <div className='writerr'>
      <p className='writer'>Abdullah Gök</p>
      </div>
      <div className="container">
 
        <div className="header">
          <h1>{post.title}</h1>
          {post.category && (
            <p>Post {post.category.name} kategorisinde</p>
          )}
        </div>
        {isEditing ? (
          <EditPostForm post={post} onEdit={handleEdit} onCancel={handleToggleEdit} />
        ) : (
          <Button className="col-2 edit" variant="primary" onClick={handleToggleModal}>
            Edit Post
          </Button>
        )}
        <div className="row">
          <div className="leftcolumn">
            <div className="card">
              <p>{post.content}</p>
              <p>{post.description}</p>

            </div>
          </div>
          <div className="rightcolumn">
            <div className="card">
              <h2>What is Lorem Ipsum?</h2>
              <Image src={kod} width={245} height={100} />
              <p>It is a long established fact that a reader will be distracted by the readable content of a page when</p>
            </div>
            <div className="card">
              <div className="categories">
            <h3 className='text-center'>Related Articles</h3>
                {categoryPosts.map((categoryPost) => (
                  
                  <Link
                    key={categoryPost.id}
                    href={`/detail?id=${categoryPost.id}&category=${selectedCategory}` }
                    className="btn nav-link col-12"
                  >
                    <button className="btn nav-link col-12">{categoryPost.title}</button>
                  </Link>
                  
                ))}
              </div>
            </div>
            <div className="card">
              <h3 className='text-center'>Categories</h3>
              <div className="categories">
              <button className="btn nav-link col-12 back" onClick={handleGoBack}>
                  All Posts
                </button>
          {categories.map((category) => (
  <button
  key={category.id}
  className={`btn nav-link col-12 ${selectedCategory === category.id ? 'active' : ''}`}
  onClick={() => handleCategoryClick(category.id)}
>
  {category.name}
</button>
          ))}
        </div>
            </div>
            <div className="card">
              <h5>Created date:</h5>
              <p> {post.created_at}</p>
              

            </div>
          </div>
        </div>
        <div className="footer">
          <a href="#">www.benim-sitem.com</a>
        </div>
      </div>
      <Modal show={showModal} onHide={handleToggleModal}>
        <Modal.Header closeButton>
          <Modal.Title>Post Düzenle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EditPostForm post={post} onEdit={handleEdit} onCancel={handleToggleModal} />
        </Modal.Body>
      </Modal>
    </div>
  );
}


function EditPostForm({ post, onEdit, onCancel }) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [description, setDescription] = useState(post.description);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title === post.title && content === post.content && description === post.description) {
      Swal.fire({
        icon: 'error',
        text: 'Hiçbir değişiklik yapılmadı. Düzenlemek için bir şeyler değiştirin.',
      });
      return;
    }
    const updatedData = {
      title,
      content,
      description,
    };
    await onEdit(updatedData);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Başlık</label>
          <input
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">İçerik</label>
          <textarea
            className="form-control"
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Açıklama</label>
          <textarea
            className="form-control"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div>
          <Button variant="primary" type="submit">
            Kaydet
          </Button>
          <Button variant="secondary" onClick={onCancel}>
            İptal
          </Button>
        </div>
      </form>
    </div>
  );
}

export default GetShow;
