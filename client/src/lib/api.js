const API_URL = 'http://localhost:3000/auth'; // Серверный URL
const BASE_URL = 'http://localhost:4000'; // Базовый URL сервера

export const registerUser = async (userData) => {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    const text = await response.text(); // Читаем текст ответа
    console.log("Ответ сервера:", text);

    try {
        const data = JSON.parse(text); // Пробуем распарсить JSON
        if (!response.ok) {
            throw new Error(data.error || 'Ошибка регистрации');
        }
        return data;
    } catch (error) {
        throw new Error('Ошибка сервера. Некорректный JSON.');
    }
};

const formatAddress = (address) => {
    // Добавляем "Беларусь" если его нет в адресе
    if (!address.toLowerCase().includes('беларусь')) {
        address = `${address}, Беларусь`;
    }
    // Заменяем запятые на пробелы для лучшего поиска
    return address.replace(/,/g, ' ').trim();
};

export const searchAddress = async (address) => {
    try {
        const response = await fetch(
            `https://geocode-maps.yandex.ru/1.x/?apikey=6471aef4-7562-4730-87e3-60a918596904&geocode=${encodeURIComponent(address)}&format=json&lang=ru_RU&results=1`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.response?.GeoObjectCollection?.featureMember?.length) {
            return [];
        }

        return data.response.GeoObjectCollection.featureMember.map(item => {
            const [lon, lat] = item.GeoObject.Point.pos.split(' ').map(Number);
            const formattedAddress = item.GeoObject.metaDataProperty.GeocoderMetaData.text;
            
            return {
                value: formattedAddress,
                label: formattedAddress,
                coordinates: {
                    lat,
                    lon
                },
                fullAddress: item.GeoObject.description,
                displayName: formattedAddress
            };
        });
    } catch (error) {
        console.error('Error searching address:', error);
        return [];
    }
};

export const geocodeAddress = async (address) => {
    try {
        const response = await fetch(
            `${BASE_URL}/api/geocode/coordinates?address=${encodeURIComponent(address)}`
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.details || 'Не удалось определить координаты');
        }

        const data = await response.json();
        return {
            lat: data.lat,
            lon: data.lon,
            displayName: data.fullAddress || data.address
        };
    } catch (error) {
        console.error('Error geocoding address:', error);
        throw error;
    }
};

export const findNearestOCP = async (lat, lon) => {
    try {
        const response = await fetch(
            `${BASE_URL}/api/ocp/nearest?lat=${lat}&lon=${lon}`
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.details || 'Не удалось найти ближайший ОЦП');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error finding nearest OCP:', error);
        throw error;
    }
};
