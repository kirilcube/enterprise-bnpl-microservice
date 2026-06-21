package main

import (
	"context"
	"testing"

	pb "backend/gen/simulator/v1"
)

func TestCalculateBNPL_PennyDistribution(t *testing.T) {
	s := &server{}

	tests := []struct {
		name          string
		amountCents   int64
		months        int32
		wantCashback  int64
		wantSchedule  []int64
		expectError   bool
	}{
		{
			name:         "Clean division (10,000 over 4 months)",
			amountCents:  1000000,
			months:       4,
			wantCashback: 80000,
			wantSchedule: []int64{250000, 250000, 250000, 250000},
			expectError:  false,
		},
		{
			name:         "The Penny Problem (10,000 over 3 months)",
			amountCents:  1000000,
			months:       3,
			wantCashback: 60000,
			wantSchedule: []int64{333334, 333333, 333333},
			expectError:  false,
		},
		{
			name:         "Heavy remainder (10,000 over 7 months)",
			amountCents:  1000000,
			months:       7,
			wantCashback: 140000,
			wantSchedule: []int64{142858, 142857, 142857, 142857, 142857, 142857, 142857},
			expectError:  false,
		},
		{
			name:         "Invalid lower-bound months guardrail",
			amountCents:  1000000,
			months:       2, // Below minimum 3
			expectError:  true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := &pb.CalculateBNPLRequest{
				AmountCents: tt.amountCents,
				Months:      tt.months,
			}

			res, err := s.CalculateBNPL(context.Background(), req)

			if tt.expectError {
				if err == nil {
					t.Errorf("Expected an error but got none")
				}
				return
			}

			if err != nil {
				t.Fatalf("Unexpected error: %v", err)
			}

			if res.CashbackCents != tt.wantCashback {
				t.Errorf("Cashback mismatch: got %d, want %d", res.CashbackCents, tt.wantCashback)
			}

			if len(res.Installments) != len(tt.wantSchedule) {
				t.Fatalf("Schedule length mismatch: got %d, want %d", len(res.Installments), len(tt.wantSchedule))
			}

			var totalDistributed int64
			for i, v := range res.Installments {
				totalDistributed += v
				if v != tt.wantSchedule[i] {
					t.Errorf("Month %d mismatch: got %d, want %d", i+1, v, tt.wantSchedule[i])
				}
			}

			if totalDistributed != tt.amountCents {
				t.Errorf("Incomplete distribution: Sum of installments (%d) does not match original amount (%d)", totalDistributed, tt.amountCents)
			}
		})
	}
}