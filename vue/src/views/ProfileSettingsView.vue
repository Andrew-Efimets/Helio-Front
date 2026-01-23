<template>
  <section class="settings">
    <div class="settings__personal personal">
      <h3 class="personal__title">Личные данные</h3>
      <div class="personal__data">
        <div class="personal__field">
          <label class="personal__label" for="name">Имя и фамилия</label>
          <span class="personal__annotation">(чтобы вас могли найти другие участники)</span>
          <input v-model="personalData.name" type="text" class="personal__input" id="name" />
        </div>
        <div class="personal__field">
          <label class="personal__label" for="phone">Номер телефона</label>
          <span class="personal__annotation">(будет использован для входа)</span>
          <input
            v-model="personalData.phone"
            v-maska
            data-maska="+7 (###) ###-##-##"
            data-maska-eager
            type="tel"
            id="phone"
            class="personal__input"
            :class="{ 'personal__input-error': errors.phone }"
            required
          />
        </div>
      </div>
    </div>
    <div class="settings__other other">
      <h3 class="other__title">Дополнительные настройки</h3>
      <div class="other__data">
        <label class="other__label" for="status">Статус</label>
        <p class="other__annotation">(что-то о себе)</p>
        <input type="text" class="other__input" id="status" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { vMaska } from 'maska/vue'
import { useAuthStore } from '@/stores/auth.ts'
import { reactive } from 'vue'
import { watch } from 'vue'

const authStore = useAuthStore()
const personalData = reactive({
  name: '',
  phone: '',
  city: '',
  birthday: '',
})
const profilePrivacy = reactive({
  showPhone: '',
  showAccount: '',
  showWall: '',
  showPhoto: '',
  showVideo: '',
  showContacts: '',
})

const errors = reactive({
  phone: '',
})

watch(
  () => authStore.user,
  (newUser) => {
    if (newUser) {
      console.log(authStore.user)
      personalData.name = newUser.name || ''
      personalData.phone = newUser.phone || ''
      if (
        personalData.phone &&
        personalData.phone.startsWith('7') &&
        !personalData.phone.startsWith('+')
      ) {
        personalData.phone = '+' + personalData.phone
        console.log(personalData.phone)
      } else {
        console.log('personalData.phone')
      }
      // personalData.city = newUser.city || ''
      // personalData.birthday = newUser.birthday || ''
    }
  },
  { immediate: true },
)

const validatePhone = () => {
  if (!personalData.phone) {
    errors.phone = 'Введите корректный номер телефона'
  } else {
    errors.phone = ''
  }
}

watch(() => personalData.phone, validatePhone)
</script>

<style scoped></style>
