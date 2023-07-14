import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.css';
import { useRouter } from 'next/router';
import { axiosapi } from './Auth';
import Swal from 'sweetalert2';
import './posts.css';
import logo from '../app/images/Logo.png';
import kod from '../app/images/kod.jpg';

import Image from 'next/image';

function GetPosts() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allPosts, setAllPosts] = useState([]);
  const [newPostData, setNewPostData] = useState({
    title: '',
    content: '',
    description: '',
    category: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Şu anki sayfa numarası
  const perPage = 10; // Her sayfada gösterilecek gönderi sayısı

    // Use Effects

  useEffect(() => {
    const fetchInitialPosts = async () => {
      await fetchPosts();

      const storedCategory = sessionStorage.getItem('selectedCategory'); // sessionStorage'dan seçili kategoriyi al
      if (storedCategory) {
        setSelectedCategory(storedCategory); // Seçili kategoriyi güncelle
      }
    };

    fetchInitialPosts();

    fetchCategories();
  }, [currentPage, selectedCategory]);

  useEffect(() => {
    filterPosts();
  }, [allPosts, selectedCategory]);

  useEffect(() => {
    if (router.query.category) {
      setSelectedCategory(router.query.category);
    }
  }, [router.query]);

   // Get Posts

  const fetchPosts = async () => {
    try {
      const response = await axiosapi.get('/posts', {
        params: { page: currentPage, perPage, category: selectedCategory },
      });
      console.log(response.data.data);
      setPosts(response.data.data);
      setAllPosts(response.data.data);
      setFilteredPosts(response.data.data);
      sessionStorage.setItem('selectedCategory', selectedCategory); // Seçili kategoriyi sessionStorage'e kaydet
    } catch (error) {
      console.error('Error fetching posts:', error);
      setErrorMessage('Yetkisiz erişim. Lütfen giriş yapın.');
    }
  };

  //Categories

  const fetchCategories = async () => {
    try {
      const response = await axiosapi.get('/get-categories');
      console.log(response.data);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filterPosts = () => {
    if (selectedCategory === '') {
      setPosts(allPosts);
    } else {
      const filtered = allPosts.filter((post) => post.category === selectedCategory);
      setPosts(filtered);
    }
  };


  const handleCategoryFilter = async (category) => {
    setSelectedCategory(category);

    try {
      const response = await axiosapi.get('/posts', {
        params: { category, page: 1, perPage },
      });
      console.log(response.data.data);
      setFilteredPosts(response.data.data);
      const filteredUrl = `posts/?category=${category}`;
      router.push(filteredUrl);
    } catch (error) {
      console.error('Gönderiler getirilirken hata oluştu:', error);
    }
  };

  const handleClearCategoryFilter = async () => {
    setSelectedCategory(''); // Seçili kategoriyi temizle
    sessionStorage.removeItem('selectedCategory'); // sessionStorage'dan seçili kategoriyi sil

    try {
      const response = await axiosapi.get('/posts', {
        params: { page: 1, perPage }, // category parametresini boş olarak gönder
      });
      console.log(response.data.data);
      setPosts(response.data.data);
      setFilteredPosts(response.data.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewPostData((prevData) => ({
      ...prevData,
      [name]: name === 'category' ? parseInt(value) : value,
    }));
    if (name === 'category') {
      setSelectedCategory(value); // Bu satırı ekleyin
    }
  };

  // Delete Post

  const handleDelete = async (postId) => {
    try {
      const confirmed = await Swal.fire({
        icon: 'warning',
        title: 'Emin misiniz?',
        text: 'Bu gönderiyi silmek istediğinizden emin misiniz?',
        showCancelButton: true,
        confirmButtonText: 'Evet, sil!',
        cancelButtonText: 'İptal',
      });

      if (confirmed.isConfirmed) {
        await axiosapi.get(`/delete/${postId}`);
        console.log('Post deleted');

        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
        setFilteredPosts((prevFilteredPosts) =>
          prevFilteredPosts.filter((post) => post.id !== postId)
        );
        fetchPosts();
        Swal.fire({
          icon: 'success',
          text: 'Gönderi başarıyla silindi.',
        });
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  

 


  // Add Post
  const handleAddPost = async (event) => {
    event.preventDefault();

    const categoryId = parseInt(selectedCategory);

    try {
      await axiosapi.post('/add', {
        ...newPostData,
        categoryId: categoryId,
      });
      console.log('Yeni gönderi eklendi');

      setIsModalOpen(false);
      setNewPostData({
        title: '',
        content: '',
        description: '',
        category: '',
      });
      fetchPosts();
      Swal.fire({
        icon: 'success',
        text: ['GÖNDERİ EKLENDİ'],
      });
    } catch (error) {
      console.error('Gönderi eklenirken hata oluştu:', error);
      setErrorMessage('Gönderi eklenirken hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewPostData({
      title: '',
      content: '',
      description: '',
      category: '',
    });
    setErrorMessage('');
  };

  // Search Post

  const handleSearch = async (event, page) => {
    const searchValue = event.target.value;
    setSearchTerm(searchValue);

    try {
      const response = await axiosapi.get('/search', {
        params: {
          term: searchValue,
          page: page, // Sayfa numarasını gönder
          perPage: 10, // Sayfa boyutunu belirle (örneğin 10 olarak kabul edelim)
        },
      });
      const filtered = response.data.data; // Sayfalanmış verileri al
      setFilteredPosts(filtered);
      const searchUrl = `posts/?search=${encodeURIComponent(searchValue)}`;
      router.push(searchUrl);
    } catch (error) {
      console.error('Error searching posts:', error);
    }
  };

  // Pagination

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };


  return (
    <div>
      <div className="container">
        <div className="col-md-5 search">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Ara..."
              value={searchTerm}
              onChange={(event) => handleSearch(event, currentPage)} // handleSearch fonksiyonunu çağırın
            />
          </div>
        </div>

        <nav className="navbar navbar-expand-lg">
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
                    <a className="nav-link active" aria-current="page" href="/">
                      Home
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div className="header">
          <h2>POSTS</h2>
        </div>
        <button className="btn btn-primary add-post" onClick={() => setIsModalOpen(true)}>
          Add Post
        </button>
        <div className="row"></div>
        <div className="row">
          <div className="leftcolumn">
            {filteredPosts.map((post, index) => (
              <div className="card" key={post.id}>
                <h2>{post.title}</h2>
                <p>{post.content}</p>
                <div className="row action">
                  <Link className="col-md-2" href={`/detail?id=${post.id}`}>
                    <span className="btn nav-link dsc no-underline">Devamını Oku...</span>
                  </Link>
                  <button
                    className="btn btn-danger col-md-1 sil"
                    onClick={() => handleDelete(post.id)}
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="rightcolumn">
            <div className="card">
              <h2>What is Lorem Ipsum?</h2>
              <Image src={kod} width={245} height={100} />
              <p>
                It is a long established fact that a reader will be distracted by the readable
                content of a page when
              </p>
            </div>
            <div className="card">
              <h3 className="text-center">Categories</h3>
              <div className="categories">
                <button
                  className={`btn nav-link ${selectedCategory === '' ? 'active' : ''}`}
                  onClick={handleClearCategoryFilter} // handleClearCategoryFilter fonksiyonunu çağırın
                >
                  Tüm Kategoriler
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={`btn nav-link ${
                      selectedCategory === category.id ? 'active' : ''
                    }`}
                    onClick={() => handleCategoryFilter(category.id)} // handleCategoryFilter fonksiyonunu çağırın
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="card">
              <h3>What is Lorem Ipsum?</h3>
              <p>
                It is a long established fact that a reader will be distracted by the readable
                content of a page when looking at its layout. The point of using Lorem Ipsum
              </p>
            </div>
          </div>
        </div>

        <div className="footer">
          <h2>
            <div className="text-center page">
              <button
                className="btn btn-primary me-2"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Önceki Sayfa
              </button>
              <button
                className="btn btn-primary"
                onClick={handleNextPage}
                disabled={filteredPosts.length < perPage}
              >
                Sonraki Sayfa
              </button>
            </div>
          </h2>
        </div>
        {isModalOpen && (
          <div className="modal show" tabIndex="-1" style={{ display: 'block' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Yeni Gönderi Ekle</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleModalClose}
                  ></button>
                </div>
                <div className="modal-body">
                  {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                  <form onSubmit={handleAddPost}>
                    <div className="mb-3">
                      <label className="form-label">Başlık</label>
                      <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={newPostData.title}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">İçerik</label>
                      <textarea
                        className="form-control"
                        name="content"
                        value={newPostData.content}
                        onChange={handleInputChange}
                        required
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Açıklama</label>
                      <textarea
                        className="form-control"
                        name="description"
                        value={newPostData.description}
                        onChange={handleInputChange}
                        required
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Kategori</label>
                      <select
                        className="form-select"
                        name="category"
                        value={newPostData.category}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Kategori Seçin</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Gönderi Ekle
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GetPosts;
