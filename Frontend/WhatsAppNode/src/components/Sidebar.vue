<script setup>
defineProps({
  usuario: {
    type: String,
    required: true,
  },
  estado: {
    type: String,
    default: '',
  },
  avatar: {
    type: String,
    required: true,
  },
  chats: {
    type: Array,
    required: true,
  },
  chatActivoId: {
    type: String,
    required: true,
  },
});

defineEmits(['seleccionar-chat']);
</script>

<template>
  <aside class="chat-sidebar">
    <div class="sidebar-header">
      <img :src="avatar" alt="Avatar" class="sidebar-avatar" />
      <div>
        <strong>{{ usuario }}</strong>
        <span>{{ estado || 'Disponible' }}</span>
      </div>
    </div>

    <div class="sidebar-list">
      <button
        v-for="chat in chats"
        :key="chat.id"
        type="button"
        class="chat-item"
        :class="{ active: chat.id === chatActivoId }"
        @click="$emit('seleccionar-chat', chat.id)"
      >
        <strong>{{ chat.nombre }}</strong>
        <span>{{ chat.tipo }}</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.chat-sidebar {
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr;
  background: rgba(255, 255, 255, 0.92);
  border-right: 1px solid rgba(23, 53, 42, 0.12);
  box-shadow: 10px 0 24px rgba(23, 53, 42, 0.06);
  overflow: hidden;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px;
  background: #f0f2f5;
  border-bottom: 1px solid rgba(23, 53, 42, 0.1);
}

.sidebar-avatar {
  width: 44px;
  height: 44px;
  flex: 0 0 auto;
  border-radius: 50%;
  object-fit: cover;
}

.sidebar-header strong,
.sidebar-header span {
  display: block;
}

.sidebar-header span {
  margin-top: 3px;
  color: #5a746b;
  font-size: 0.82rem;
}

.sidebar-list {
  padding: 10px;
  overflow-y: auto;
}

.chat-item {
  width: 100%;
  display: grid;
  gap: 4px;
  margin-bottom: 6px;
  padding: 14px 12px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #17352a;
  font: inherit;
  font-weight: 800;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s ease;
}

.chat-item span {
  color: #5a746b;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: capitalize;
}

.chat-item:hover,
.chat-item.active {
  background: #e9f6ef;
}

@media (max-width: 680px) {
  .chat-sidebar {
    min-height: auto;
    border-right: 0;
    border-bottom: 1px solid rgba(23, 53, 42, 0.12);
  }

  .sidebar-list {
    display: flex;
    gap: 8px;
    overflow-x: auto;
  }

  .chat-item {
    min-width: 160px;
  }
}
</style>
