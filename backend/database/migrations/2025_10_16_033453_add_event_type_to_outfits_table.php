<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddEventTypeToOutfitsTable extends Migration
{
    public function up()
    {
        Schema::table('outfits', function (Blueprint $table) {
            $table->string('event_type')->nullable()->after('title');
        });
    }

    public function down()
    {
        Schema::table('outfits', function (Blueprint $table) {
            $table->dropColumn('event_type');
        });
    }
}
