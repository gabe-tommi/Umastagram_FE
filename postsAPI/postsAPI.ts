
import axios from 'axios';

// Mock posts data
export const mockPosts = [
    {
        id: 1,
        userId: 101,
        text: "Teio Teio",
        image: "https://static.wikia.nocookie.net/umamusume/images/7/7f/Tokai_Teio_%28Main%29.png/revision/latest?cb=20240731204919",
        datePosted: "2025-11-12T14:30:00",
        likes: 142,
    },
    {
        id: 2,
        userId: 102,
        text: "Im winning my ticket",
        image: "https://static.wikia.nocookie.net/umamusume/images/6/66/Winning_Ticket_%28Main%29.png/revision/latest?cb=20240731204921",
        datePosted: "2025-11-12T10:15:00",
        likes: 87,
    },
    {
        id: 3,
        userId: 103,
        text: "fuku pull",
        image: "https://media.discordapp.net/attachments/1350656541640101970/1438365130445557831/IMG_3380.png?ex=69169d6a&is=69154bea&hm=1b26c870c3bfe7cff48aba7d7ec1dab81ced693d78e30fa535ab73095321759e&=&format=webp&quality=lossless&width=324&height=700",
        datePosted: "2025-11-11T18:45:00",
        likes: 256,
    },
];

//function for grabbing posts
export const getPosts = async (params = {}) => {
    const options = {
        method: 'GET',
        url: 'https://beuma-64bbab9df83e.herokuapp.com/api/posts',
    };

    try {
        const response = await axios.request(options);
        console.log('Posts fetched:', response.data);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const createPost = async (userId: number, text: string, image: string) => {
    const postData = {
        userId,
        text,
        image,
    };

    const options = {
        method: 'POST',
        url: 'https://beuma-64bbab9df83e.herokuapp.com/api/posts',
        headers: { 'Content-Type': 'application/json' },
        data: postData,
    };

    try {
        const response = await axios.request(options);
        console.log('Post created:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
};