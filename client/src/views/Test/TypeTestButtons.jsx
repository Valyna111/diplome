import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import StoreContext from '@/store/StoreContext';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_TYPE, UPDATE_TYPE } from "@/graphql/mutations";
import { GET_TYPE } from "@/graphql/queries";
import client from "@/apolloClient";

const fetchType = async (typeid) => {
    try {
        const { data } = await client.query({
            query: GET_TYPE,
            variables: { typeid },
        });
        console.log('Полученный тип:', data.typeByTypeid);
        return data;
    } catch (error) {
        console.error('Ошибка получения типа:', error);
        console.error('Детали ошибки:', error.networkError?.result);
    }
};

const TypeTestButtons = observer(() => {
    const rootStore = useContext(StoreContext);

    // Хук для выполнения мутации создания типа
    const [createType] = useMutation(CREATE_TYPE);
    // Хук для выполнения мутации обновления типа
    const [updateType] = useMutation(UPDATE_TYPE);
    // Хук для выполнения запроса получения типа

    // Функция для создания типа
    const handleCreateType = async () => {
        try {
            const { data } = await createType({
                variables: {
                    typeid: 1,
                    name: 'Test Type',
                },
            });
            console.log('Созданный тип:', data.createType.type);
        } catch (error) {
            console.error('Ошибка создания типа:', error);
            console.error('Детали ошибки:', error.networkError?.result?.errors);
        }
    };

    // Функция для получения типа
    const handleGetType = async () => {
        const type = await fetchType(1); // Получить тип с ID = 1
        if (type) {
            console.log('Тип успешно получен:', type);
        }
    };

    // Функция для обновления типа
    const handleUpdateType = async () => {
        try {
            const { data } = await updateType({
                variables: {
                    typeid: 1,
                    name: 'Updated Type',
                },
            });
            console.log('Обновленный тип:', data.updateTypeById.type);
        } catch (error) {
            console.error('Ошибка обновления типа:', error);
            console.error('Детали ошибки:', error.networkError?.result?.errors);
        }
    };

    return (
        <div>
            <h2>Тестирование работы с типами (Type)</h2>
            <button onClick={handleCreateType}>Создать тип</button>
            <button onClick={handleGetType}>Получить тип</button>
            <button onClick={handleUpdateType}>Обновить тип</button>
        </div>
    );
});

export default TypeTestButtons;