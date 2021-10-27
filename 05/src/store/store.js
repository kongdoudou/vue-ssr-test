import Vue from 'vue';
import Vuex from 'vuex';
import {fetchCards, fetchCustomData, fetchVideo} from '../api'

Vue.use(Vuex);

function createStore() {
  const store = new Vuex.Store({
    state: {
      bar: '',
      cards: []
    },

    mutations: {
      'SET_VIDEOS'(state, videosData) {
        let cards = [...state.cards];
        console.log(cards);
        cards = cards.map(card => {
          if(card.customData.rId) {
            card.sourceData = videosData[0];
            videosData.splice(0,1)
          }
        });
        // state.cards = cards;
      },
      'SET_CARDS'(state, data) {
        state.cards = data;
      }
    },

    actions: {
      // 获取组件的自定义数据
      fetchData({ commit, state }, pageId) {
        let pageCards = [];
        return fetchCards(pageId).then(cards => {
          if(cards && cards.length) {
            let resAry = [];
            cards.map(card => {
              resAry.push(fetchCustomData(card))
            })
            if(resAry && resAry.length) {
              return Promise.all(resAry)
            }
          }
        }).then(cardsData => {
          console.log('cardsData', cardsData);
          if(cardsData && cardsData.length) {
            let getResources = []
            cardsData.map(cardData => {
              if(cardData.customData && cardData.customData.rId) {
                cardData.reqIndex = getResources.length;
                getResources.push(fetchVideo(cardData.customData.rId))
              }
            });
            pageCards = cardsData;
            return Promise.all(getResources)
          }
        }).then(videosData => {
          console.log('videosData', videosData.length)
          pageCards = pageCards.map(pageCard => {
            let videoData = videosData[pageCard.reqIndex];
            // videoData = videoData.map(item => item.mixinVideo);
            pageCard.sourceData = videoData;
            return pageCard;
          });
          commit('SET_CARDS', pageCards);
          return pageCards;
        }).catch(err=> {
          console.error(err)
        })
      }
    }
  });

  if (typeof window !== 'undefined' && window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__);
  } else {
    console.log('no browser');
  }

  return store;
}

export default createStore;
