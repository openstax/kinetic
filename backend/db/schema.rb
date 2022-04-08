# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2022_04_08_162010) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "admins", force: :cascade do |t|
    t.uuid "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_admins_on_user_id", unique: true
  end

  create_table "banners", force: :cascade do |t|
    t.text "message", null: false
    t.datetime "start_at", null: false
    t.datetime "end_at", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "launched_stages", force: :cascade do |t|
    t.bigint "stage_id", null: false
    t.uuid "user_id"
    t.datetime "first_launched_at"
    t.datetime "completed_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["stage_id"], name: "index_launched_stages_on_stage_id"
    t.index ["user_id", "stage_id"], name: "index_launched_stages_on_user_id_and_stage_id", unique: true
  end

  create_table "launched_studies", force: :cascade do |t|
    t.bigint "study_id", null: false
    t.uuid "user_id", null: false
    t.datetime "first_launched_at"
    t.datetime "completed_at"
    t.datetime "opted_out_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.datetime "aborted_at"
    t.boolean "consent_granted"
    t.index ["study_id"], name: "index_launched_studies_on_study_id"
    t.index ["user_id", "study_id"], name: "index_launched_studies_on_user_id_and_study_id", unique: true
  end

  create_table "participant_metadata", force: :cascade do |t|
    t.uuid "user_id", null: false
    t.bigint "study_id", null: false
    t.jsonb "metadata"
    t.datetime "created_at"
    t.index ["study_id"], name: "index_participant_metadata_on_study_id"
    t.index ["user_id"], name: "index_participant_metadata_on_user_id"
  end

  create_table "research_ids", id: :text, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_research_ids_on_user_id", unique: true
  end

  create_table "researchers", force: :cascade do |t|
    t.uuid "user_id", null: false
    t.string "name"
    t.string "institution"
    t.text "bio"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_researchers_on_user_id", unique: true
  end

  create_table "rewards", force: :cascade do |t|
    t.text "description", null: false
    t.text "info_url"
    t.integer "points", null: false
    t.datetime "start_at", null: false
    t.datetime "end_at", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "stages", force: :cascade do |t|
    t.bigint "study_id", null: false
    t.integer "order", null: false
    t.jsonb "config", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "title"
    t.string "description"
    t.float "available_after_days", default: 0.0, null: false
    t.index ["order", "study_id"], name: "index_stages_on_order_and_study_id", unique: true
    t.index ["study_id"], name: "index_stages_on_study_id"
  end

  create_table "studies", force: :cascade do |t|
    t.string "title_for_researchers"
    t.string "title_for_participants", null: false
    t.text "short_description", null: false
    t.text "long_description", null: false
    t.integer "duration_minutes", null: false
    t.integer "participation_points"
    t.datetime "opens_at"
    t.datetime "closes_at"
    t.boolean "is_mandatory", default: false, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "tags", default: [], null: false, array: true
    t.index ["tags"], name: "index_studies_on_tags", using: :gin
  end

  create_table "study_researchers", force: :cascade do |t|
    t.bigint "study_id", null: false
    t.bigint "researcher_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["researcher_id", "study_id"], name: "index_study_researchers_on_researcher_id_and_study_id", unique: true
    t.index ["researcher_id"], name: "index_study_researchers_on_researcher_id"
    t.index ["study_id"], name: "index_study_researchers_on_study_id"
  end

  add_foreign_key "launched_stages", "stages"
  add_foreign_key "launched_studies", "studies"
  add_foreign_key "participant_metadata", "studies"
  add_foreign_key "stages", "studies"
  add_foreign_key "study_researchers", "researchers"
  add_foreign_key "study_researchers", "studies"
end
