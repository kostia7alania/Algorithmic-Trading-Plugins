import pandas as pd
import sys

def main():
    if len(sys.argv) < 3:
        print("Usage: python process.py <input_csv> <output_csv>")
        sys.exit(1)

    input_csv = sys.argv[1]
    output_csv = sys.argv[2]

    try:
        df = pd.read_csv(input_csv)
    except Exception as e:
        print(f"Error reading {input_csv}: {e}")
        sys.exit(1)

    if 'price' not in df.columns:
        print("Error: 'price' column not found in input CSV.")
        sys.exit(1)

    df['ma7'] = df['price'].rolling(window=7, min_periods=1).mean()
    df['ma30'] = df['price'].rolling(window=30, min_periods=1).mean()

    try:
        df.to_csv(output_csv, index=False)
    except Exception as e:
        print(f"Error writing to {output_csv}: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
