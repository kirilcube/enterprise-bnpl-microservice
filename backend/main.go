package main

import (
	"context"
	"log"
	"net/http"

	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	// Generated code path from protoc
	pb "backend/gen/simulator/v1"

	"github.com/improbable-eng/grpc-web/go/grpcweb"
)

type server struct {
	pb.UnimplementedSimulatorServiceServer
}

const CashbackPercentPerMonth int64 = 2

// CalculateBNPL implements the business logic and solves the Penny Problem
func (s *server) CalculateBNPL(ctx context.Context, req *pb.CalculateBNPLRequest) (*pb.CalculateBNPLResponse, error) {
	amount := req.GetAmountCents()
	months := int64(req.GetMonths())

	// 1. Validation Guardrails
	if amount <= 0 {
		return nil, status.Error(codes.InvalidArgument, "Amount must be greater than zero")
	}
	if months < 3 || months > 12 {
		return nil, status.Error(codes.InvalidArgument, "Months must be between 3 and 12")
	}

	// 2. Exact Integer Cashback Calculation
    cashbackPercent := CashbackPercentPerMonth * months
    cashbackCents := (amount * cashbackPercent) / 100

	// 3. Mathematical Remainder Distribution (The Penny Problem Solution)
	basePayment := amount / months
	remainder := amount % months

	installments := make([]int64, months)
	for i := int64(0); i < months; i++ {
		installments[i] = basePayment
		// Distribute leftover pennies one-by-one to early months
		if i < remainder {
			installments[i]++
		}
	}

	// 4. Return the newly updated contract response
	return &pb.CalculateBNPLResponse{
		CashbackCents:    cashbackCents,
		CashbackPercents: int32(cashbackPercent),
		Installments:     installments,
	}, nil
}

func main() {
	// 1. Create standard gRPC server
	grpcServer := grpc.NewServer()
	pb.RegisterSimulatorServiceServer(grpcServer, &server{})

	// 2. Wrap standard gRPC server with the gRPC-Web proxy wrapper
	wrappedServer := grpcweb.WrapServer(grpcServer,
		grpcweb.WithOriginFunc(func(origin string) bool {
			// In production, restrict this to your actual Angular domain
			return true
		}),
	)

	// 3. Direct dual handling function (Multiplexer)
	httpHandler := func(w http.ResponseWriter, req *http.Request) {
		// If it's a gRPC-Web request from the browser, route it to the wrapper
		if wrappedServer.IsGrpcWebRequest(req) {
			wrappedServer.ServeHTTP(w, req)
			return
		}

		// Fallback for standard HTTP (useful for infrastructure healthchecks)
		if req.URL.Path == "/health" {
			w.WriteHeader(http.StatusOK)
			w.Write([]byte("OK"))
			return
		}
		w.WriteHeader(http.StatusNotFound)
	}

	// 4. Start the server
	addr := ":8080"
	log.Printf("Starting gRPC and gRPC-Web server on %s", addr)
	if err := http.ListenAndServe(addr, http.HandlerFunc(httpHandler)); err != nil {
		log.Fatalf("Failed to serve: %v", err)
	}
}