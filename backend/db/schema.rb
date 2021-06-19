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

ActiveRecord::Schema.define(version: 2021_06_18_183842) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "admins", force: :cascade do |t|
    t.uuid "user_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_admins_on_user_id"
  end

  create_table "participant_stages", force: :cascade do |t|
    t.bigint "stage_id", null: false
    t.uuid "user_id"
    t.datetime "first_launched_at"
    t.datetime "completed_at"
    t.index ["stage_id"], name: "index_participant_stages_on_stage_id"
    t.index ["user_id"], name: "index_participant_stages_on_user_id"
  end

  create_table "participant_studies", force: :cascade do |t|
    t.bigint "study_id", null: false
    t.uuid "user_id"
    t.datetime "opted_out_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["study_id"], name: "index_participant_studies_on_study_id"
    t.index ["user_id"], name: "index_participant_studies_on_user_id"
  end

  create_table "researchers", force: :cascade do |t|
    t.uuid "user_id"
    t.string "first_name"
    t.string "last_name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_researchers_on_user_id"
  end

  create_table "stages", force: :cascade do |t|
    t.bigint "study_id", null: false
    t.integer "order", null: false
    t.jsonb "config"
    t.string "labs_return_url"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["study_id"], name: "index_stages_on_study_id"
  end

  create_table "studies", force: :cascade do |t|
    t.string "name_for_researchers"
    t.string "name_for_participants", null: false
    t.text "description_for_researchers"
    t.text "description_for_participants", null: false
    t.string "category", null: false
    t.integer "duration_minutes"
    t.datetime "opens_at"
    t.datetime "closes_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "study_researchers", force: :cascade do |t|
    t.bigint "study_id", null: false
    t.bigint "researcher_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["researcher_id"], name: "index_study_researchers_on_researcher_id"
    t.index ["study_id"], name: "index_study_researchers_on_study_id"
  end

  add_foreign_key "participant_stages", "stages"
  add_foreign_key "participant_studies", "studies"
  add_foreign_key "stages", "studies"
  add_foreign_key "study_researchers", "researchers"
  add_foreign_key "study_researchers", "studies"
end
