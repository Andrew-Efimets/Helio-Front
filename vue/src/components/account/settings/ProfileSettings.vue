<template>
  <form class="personal" @submit.prevent="saveSettings" novalidate>
    <div class="data">
      <div v-for="field in formFields" :key="field.id" class="field">
        <label class="label" :for="field.id">{{ field.label }}</label>
        <span v-if="field.annotation" class="annotation">{{ field.annotation }}</span>

        <input
          v-model="personalData[field.key as keyof typeof personalData]"
          :type="field.type"
          :id="field.id"
          class="input"
          :class="{ 'input-error': errors[field.key as keyof typeof errors] }"
          v-maska="field.mask || ''"
        />

        <span v-if="errors[field.key as keyof typeof errors]" class="field-error">
          {{ errors[field.key as keyof typeof errors] }}
        </span>
      </div>
    </div>

    <p v-if="serverError" class="error">{{ serverError }}</p>
    <p v-if="isSuccess" class="success">Данные успешно обновлены</p>

    <div class="buttons-wrapper">
      <button type="submit" class="button" :disabled="!isFormValid || isLoading || !isChanged">
        {{ isLoading ? 'Сохранение...' : 'Сохранить изменения' }}
      </button>
      <button
        type="button"
        class="button button--danger"
        @click="isConfirmOpen = true"
        :disabled="isLoading"
      >
        удалить аккаунт
      </button>
    </div>

    <ConfirmModal :is-open="isConfirmOpen" @close="isConfirmOpen = false" @confirm="deleteAccount">
      <p>Вы действительно хотите удалить аккаунт?</p>
      <template #button__text>Да, удалить</template>
    </ConfirmModal>
  </form>
</template>

<script setup lang="ts">
import { vMaska } from 'maska/vue'
import { useAuthStore } from '@/stores/auth.ts'
import { reactive, watch, computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/api.ts'
import ConfirmModal from '@/components/details/ConfirmModal.vue'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const isLoading = ref(false)
const serverError = ref('')
const isSuccess = ref(false)
const isConfirmOpen = ref(false)

const personalData = reactive({
  name: '',
  phone: '',
  country: '',
  city: '',
  birthday: '',
})

const formFields = [
  {
    id: 'name',
    key: 'name',
    label: 'Имя и фамилия',
    type: 'text',
    annotation: '(чтобы вас могли найти другие участники)',
  },
  {
    id: 'phone',
    key: 'phone',
    label: 'Номер телефона',
    type: 'tel',
    annotation: '(будет использован для входа)',
    mask: '+7 (###) ###-##-##',
  },
  { id: 'country', key: 'country', label: 'Страна проживания', type: 'text' },
  { id: 'city', key: 'city', label: 'Город проживания', type: 'text' },
  { id: 'birthday', key: 'birthday', label: 'Дата рождения', type: 'date' },
]

const errors = computed(() => ({
  phone: personalData.phone.length > 0 && personalData.phone.length < 18 ? 'Неверный формат' : '',
  birthday: personalData.birthday && personalData.birthday.length < 10 ? 'Ошибка даты' : '',
  name: personalData.name.length > 0 && personalData.name.length < 3 ? 'Слишком короткое имя' : '',
}))

const isFormValid = computed(() => {
  return personalData.name.length >= 3 && personalData.phone.length === 18 && !errors.value.birthday
})

watch(
  () => authStore.user,
  (user) => {
    if (!user) return
    personalData.name = user.name || ''
    personalData.phone = user.phone || ''
    if (user.profile) {
      personalData.country = user.profile.country || ''
      personalData.city = user.profile.city || ''
      personalData.birthday = user.profile.birthday ? user.profile.birthday.slice(0, 10) : ''
    }
  },
  { immediate: true },
)

const saveSettings = async () => {
  serverError.value = ''
  isSuccess.value = false
  try {
    isLoading.value = true
    const cleanPhone = personalData.phone.replace(/\D/g, '')
    const { data } = await api.patch(`/user/${authStore.user?.id}`, {
      name: personalData.name,
      phone: cleanPhone,
      country: personalData.country || null,
      city: personalData.city || null,
      birthday: personalData.birthday || null,
    })
    if (data?.data) authStore.setUser(data.data)
    isSuccess.value = true
    setTimeout(() => (isSuccess.value = false), 5000)
  } catch (err: any) {
    serverError.value = err.formattedMessage || 'Ошибка сохранения'
  } finally {
    isLoading.value = false
  }
}

const deleteAccount = async () => {
  isConfirmOpen.value = false
  try {
    isLoading.value = true
    await api.delete(`/user/${route.params.id}`)
    authStore.reset()
    await router.replace({ name: 'login' })
  } catch {
    serverError.value = 'Ошибка удаления'
  } finally {
    isLoading.value = false
  }
}

const isChanged = computed(() => {
  const user = authStore.user
  if (!user) return false

  const nameChanged = personalData.name !== (user.name || '')

  const currentPhoneClean = personalData.phone.replace(/\D/g, '')
  const phoneChanged = currentPhoneClean !== (user.phone || '')

  const profile = user.profile

  const countryChanged = personalData.country !== (profile?.country || '')
  const cityChanged = personalData.city !== (profile?.city || '')

  const originalBirthday = profile?.birthday ? profile?.birthday.slice(0, 10) : ''
  const birthdayChanged = personalData.birthday !== originalBirthday

  return nameChanged || phoneChanged || countryChanged || cityChanged || birthdayChanged
})
</script>

<style scoped>
.field-error {
  color: darkred;
  font-size: 14px;
  margin-top: 10px;
}

.error {
  width: 100%;
  font-size: 16px;
  margin: 10px 0;
  padding: 20px;
  background-color: #e99a9a;
  color: darkred;
}

.success {
  width: 100%;
  margin: 10px 0;
  padding: 20px;
  font-size: 16px;
  background-color: #beeabe;
  color: darkgreen;
}

.input-error {
  border-color: darkred;
}

.personal {
  padding: 20px;
}

.field {
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  color: #6e2c11;
}

.label {
  font-size: 18px;
  font-weight: 600;
}

.input {
  margin: 10px 0;
  padding: 5px 10px;
  color: #6e2c11;
  font-size: 16px;
  border: #6e2c11 2px solid;
  border-radius: 18px;
}

.input:focus {
  outline: none;
  border: 2px solid #be7f19;
  box-shadow: 0 0 5px rgba(190, 127, 25, 0.5);
}

.buttons-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@media screen and (max-width: 768px) {
  .buttons-wrapper {
    flex-direction: column;
  }
}
</style>
