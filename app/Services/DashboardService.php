<?php

declare(strict_types=1);

namespace App\Services;

use Carbon\Carbon;
use Illuminate\Support\Collection;

class DashboardService
{
    public function __construct(private readonly UserService $userService)
    {
    }

    public function getSignupChartData(int $days = 90): Collection
    {
        // Get raw signup counts per date
        $signupsByDate = $this->userService->getSignupsGroupedByDate($days);

        // Build date range (last $days days)
        $dates = collect(range(0, $days - 1))->map(function ($i) use ($days) {
            return Carbon::now()->subDays($days - 1 - $i)->format('Y-m-d');
        });

        // Map into final data: fill missing dates with 0
        return $dates->map(function ($date) use ($signupsByDate) {
            return [
                'date' => $date,
                'signups' => $signupsByDate[$date] ?? 0,
            ];
        });
    }
}
