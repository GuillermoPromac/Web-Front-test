<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import Rating from 'primevue/rating';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import { useCommunityManagementStore } from '../../application/community-management.store.js';
import { Comment } from '../../domain/model/comment.entity.js';

/**
 * Component for viewing a community member's mural, rating them, and leaving comments.
 * Uses Vue I18n for internationalization and Pinia for state management.
 */

const { t } = useI18n();
const toast = useToast();
const store = useCommunityManagementStore();
const route = useRoute();
const router = useRouter();

/**
 * Reactive reference for the current community profile being viewed.
 * @type {import('vue').Ref<Object|null>}
 */
const profile = ref(null);

/**
 * Reactive reference for the text content of a new comment.
 * @type {import('vue').Ref<string>}
 */
const newCommentText = ref('');

/**
 * Reactive reference for the star rating given by the current user.
 * @type {import('vue').Ref<number>}
 */
const userRating = ref(0);

/**
 * Computed property that retrieves comments specifically targeted at the current profile.
 * Filters the global comments list using the target profile's ID.
 * @type {import('vue').ComputedRef<Array>}
 */
const muralComments = computed(() => {
  if (!profile.value) return [];
  return store.getCommentsByTargetProfileId(profile.value.profile_id);
});

/**
 * Lifecycle hook: Initializes data by fetching profiles and comments from the API if not loaded,
 * then assigns the specific profile based on the route parameter 'id'.
 * Redirects to the list view if the profile is not found.
 */
onMounted(async () => {
  if (!store.profilesLoaded) await store.fetchProfiles();
  if (!store.commentsLoaded) await store.fetchComments();

  profile.value = store.getProfileById(route.params.id);

  if (!profile.value) {
    router.push({ name: 'community-profile-list' });
  }
});

/**
 * Retrieves the author's nickname based on their profile ID.
 * Cross-references the global profiles list to find the matching user.
 * * @param {string} authorProfileId - The ID of the comment's author.
 * @returns {string} The author's nickname, or the raw ID if the profile is not found.
 */
const getAuthorName = (authorProfileId) => {
  const author = store.profiles.find(p => p.profile_id === authorProfileId);
  return author ? author.nickname : authorProfileId;
};

/**
 * Handles the publication of a new review (rating + comment text).
 * Validates input, creates a new Comment entity, updates the store,
 * and handles UI feedback (toasts).
 * * @returns {Promise<void>}
 */
const publishReview = async () => {

  if (!newCommentText.value.trim()) {
    toast.add({ severity: 'warn', summary: t('community.mural.warning'), detail: t('community.mural.warningCommentRequired'), life: 3000 });
    return;
  }

  const newComment = new Comment({
    author_profile_id: 'prof_001',
    target_profile_id: profile.value.profile_id,
    content: newCommentText.value,
    rating: userRating.value
  });


  const success = await store.addComment(newComment);

  if (success) {

    if (userRating.value > 0) {
      profile.value.reputation_score += userRating.value;
      await store.updateProfile(profile.value);
    }


    newCommentText.value = '';
    userRating.value = 0;

    toast.add({ severity: 'success', summary: t('community.mural.success'), detail: t('community.mural.successPublished'), life: 3000 });
  } else {
    toast.add({ severity: 'error', summary: t('community.mural.error'), detail: t('community.mural.errorPublishing'), life: 3000 });
  }
};

/**
 * Navigates back to the community profile list view.
 */
const goBack = () => router.push({ name: 'community-profile-list' });
</script>

<template>
  <div class="mural-container" v-if="profile">
    <Toast />

    <Button icon="pi pi-arrow-left" :label="t('community.mural.back')" class="p-button-text mb-3" @click="goBack" />

    <div class="profile-header card">
      <div class="header-info">
        <h2>{{ profile.nickname }}</h2>
        <p class="bio">"{{ profile.public_bio }}"</p>
        <div class="reputation-badge">
          <i class="pi pi-star-fill text-yellow-500"></i>
          <span>{{ t('community.mural.globalReputation') }}: {{ profile.reputation_score }}</span>
        </div>
      </div>
    </div>

    <div class="comments-section card mt-4">
      <h3>{{ t('community.mural.title') }}</h3>

      <div class="add-review-box mb-4">
        <div class="flex align-items-center mb-2 gap-3">
          <span class="font-bold">{{ t('community.mural.rateMember') }}:</span>
          <Rating v-model="userRating" :cancel="false" />
        </div>

        <Textarea v-model="newCommentText" rows="3" :placeholder="t('community.mural.writeComment')" class="w-full mb-2" />

        <Button :label="t('community.mural.publishReview')" icon="pi pi-send" @click="publishReview" :disabled="!newCommentText" />
      </div>

      <div class="comments-list mt-4">
        <div v-if="muralComments.length === 0" class="no-comments">
          {{ t('community.mural.noComments') }}
        </div>

        <div v-for="comment in muralComments" :key="comment.id" class="comment-item">
          <div class="comment-header flex">
            <div class="comment-author">
              <i class="pi pi-user mr-2"></i>
              <strong>{{ getAuthorName(comment.author_profile_id) }}</strong>
              <span class="text-sm text-gray-500 ml-2">{{ comment.created_at }}</span>
            </div>
          </div>
          <p class="comment-content mt-2">{{ comment.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.mural-container { padding: 2rem; max-width: 800px; margin: 0 auto; }
.card { background: #ffffff; border-radius: 8px; padding: 1.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
.profile-header { display: flex; justify-content: space-between; align-items: center; }
.bio { font-style: italic; color: #64748b; margin-bottom: 1rem; }
.reputation-badge { display: inline-flex; align-items: center; gap: 0.5rem; background: #f8fafc; padding: 0.5rem 1rem; border-radius: 20px; font-weight: bold; }

.add-review-box { background: #f8fafc; padding: 1.5rem; border-radius: 8px; border: 1px solid #e2e8f0; }
.w-full { width: 100%; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-3 { margin-bottom: 1rem; }
.mb-4 { margin-bottom: 1.5rem; }
.mt-2 { margin-top: 0.5rem; }
.mt-4 { margin-top: 1.5rem; }
.gap-3 { gap: 1rem; }
.comment-item { padding: 1.5rem; border-bottom: 1px solid #e2e8f0; background: #ffffff; margin-bottom: 1rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
.comment-item:last-child { border-bottom: none; }
.comment-author { color: #334155; }
.comment-content { color: #475569; line-height: 1.5; }
.no-comments { text-align: center; color: #94a3b8; padding: 2rem; font-style: italic; }
</style>